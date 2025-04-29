import { register, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import {
  GameUiKey,
  HexKeyCodes,
  IVehicleHudUpdate,
  IVehicleStats,
  IVehicleUpdateData,
  ProcedureKey,
  VehicleIndicator,
  VehicleSharedDataType
} from '@revolt-rp/common';
import { isKeyBindRegistered, registerKeyBind, unregisterKeyBind } from '../core/keybind-manager';
import { browser, hideGameInterface, isGameInterfaceActive, showGameInterface } from '../core/browser';
import {
  getVehicleAcceleration,
  getVehicleClassName,
  getVehicleDisplayName,
  getVehicleMaxBraking,
  getVehicleMaxNumberOfPassengers,
  getVehicleMaxSpeed,
  getVehicleModelMaxTraction, isNearHood, isNearTrunk,
  isValidVehicleWindow,
  isVehicleModelValid
} from './vehicle.util';
import { getIsAlive, getIsNotCuffed, getIsSpawned } from '../player/util/player-data.util';
import { getDistance } from '../util/vector.util';
import { isVehicleTrunkOpened } from './vehicle-data';


mp.game.vehicle.defaultEngineBehaviour = false;
mp.players.local.setConfigFlag(241, true);
mp.players.local.setConfigFlag(429, true);

export const KMH_FRACTION = 3.6;
const RPM_MULTIPLIER = 5000;
const FUEL_CONSUMPTION_RATE = 0.001;
const MILEAGE_CONVERSION = 1 / 1000;
const CONSUMPTION_TIME_MS = 1000;

const VEHICLE_ENGINE_TOGGLE_HOLD_TIME = 2000;

let currentMileage = 0.00,
  currentFuel = 0,
  lastVehiclePosition: Vector3 | null = null,
  lastVehCalculationUpdate = Date.now();


function toggleVehicleEngine() {
  const vehicle = mp.players.local.vehicle;
  if (vehicle && vehicle.getPedInSeat(RageEnums.VehicleSeat.DRIVER) === mp.players.local.handle) {
    triggerServer(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_ENGINE);
  }
}

function toggleVehicleMenu() {
  if (mp.players.local.vehicle) {
    if (isGameInterfaceActive(GameUiKey.VehicleMenu)) {
      hideGameInterface(GameUiKey.VehicleMenu);
    } else {
      showGameInterface(GameUiKey.VehicleMenu);
    }
  }
}

function toggleSeatbelt() {
  triggerServer(ProcedureKey.SERVER_PLAYER_TOGGLE_SEATBELT);
}

function toggleVehicleLeftIndicator() {
  triggerServer(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_INDICATOR, VehicleIndicator.Left);
}

function toggleVehicleRightIndicator() {
  triggerServer(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_INDICATOR, VehicleIndicator.Right);
}

function calculateVehicleConsumption() {
  const now = Date.now();
  if (now - lastVehCalculationUpdate < CONSUMPTION_TIME_MS) return;
  lastVehCalculationUpdate = now;

  const currentPosition = mp.players.local.vehicle.position;
  let deltaDistance = 0;

  if (lastVehiclePosition) {
    const dx = currentPosition.x - lastVehiclePosition.x;
    const dy = currentPosition.y - lastVehiclePosition.y;
    const dz = currentPosition.z - lastVehiclePosition.z;
    deltaDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  currentMileage += (deltaDistance * MILEAGE_CONVERSION);

  const fuelConsumption = deltaDistance * FUEL_CONSUMPTION_RATE;
  currentFuel = Math.max(0, currentFuel - fuelConsumption);

  lastVehiclePosition = currentPosition;
}

export function toggleVehicleHud(toggle: boolean, forHide = false) {
  if (toggle) {
    showGameInterface(GameUiKey.VehicleHud);

    if (!forHide)
      mp.events.add('render', updateVehicleHud);
  } else {
    hideGameInterface(GameUiKey.VehicleHud);

    if (!forHide)
      mp.events.remove('render', updateVehicleHud);
  }
}

function updateVehicleHud() {
  const vehicle = mp.players.local.vehicle;

  if (vehicle) {
    const { lightsOn, highbeamsOn: highBeamsOn } = vehicle.getLightsState(1, 1);

    const vehicleHudUpdate: IVehicleHudUpdate = {
      speed: Math.trunc(vehicle.getSpeed() * KMH_FRACTION),
      rpm: Math.trunc(vehicle.rpm * RPM_MULTIPLIER),
      gear: vehicle.gear,
      fuel: currentFuel,
      mileage: currentMileage,
      lightsOn,
      highBeamsOn
    };

    triggerBrowser(browser, ProcedureKey.BROWSER_UPDATE_VEHICLE_HUD, vehicleHudUpdate);

    calculateVehicleConsumption();
  }
}


function playerEnterVehicleHandler(vehicle: VehicleMp, seat: number) {
  if (vehicle) {
    if (
      !mp.game.vehicle.isThisModelABicycle(vehicle.model) &&
      !mp.game.vehicle.isThisModelABike(vehicle.model) &&
      !mp.game.vehicle.isThisModelABoat(vehicle.model)
    ) {
      registerKeyBind(HexKeyCodes.B, true, toggleSeatbelt);
    }

    if (seat == RageEnums.VehicleSeat.DRIVER) {
      mp.players.local.setConfigFlag(241, true); // Disable player attempts to run engine causing glitch
      mp.players.local.setConfigFlag(429, true); // Disable turning off the engine when exiting a vehicle

      registerKeyBind(HexKeyCodes.Y, true, toggleVehicleMenu, 0);

      if (mp.game.vehicle.isThisModelABicycle(vehicle.model)) {
        if (!vehicle.getIsEngineRunning())
          toggleVehicleEngine();

        return;
      }

      currentMileage = vehicle.getVariable(VehicleSharedDataType.Mileage) || 0.00;
      currentFuel = vehicle.getVariable(VehicleSharedDataType.Fuel) || 0;

      registerKeyBind(HexKeyCodes.Y, false, toggleVehicleEngine, VEHICLE_ENGINE_TOGGLE_HOLD_TIME);
      registerKeyBind(HexKeyCodes.Left, true, toggleVehicleLeftIndicator);
      registerKeyBind(HexKeyCodes.Right, true, toggleVehicleRightIndicator);

      toggleVehicleHud(true);
    }
  }
}

function playerLeaveVehicleHandler(vehicle: VehicleMp, seat: number) {
  if (vehicle) {
    if (isKeyBindRegistered(HexKeyCodes.B, toggleSeatbelt)) {
      unregisterKeyBind(HexKeyCodes.B, toggleSeatbelt);
    }

    if (isGameInterfaceActive(GameUiKey.VehicleMenu)) {
      hideGameInterface(GameUiKey.VehicleMenu);
    }

    if (seat == RageEnums.VehicleSeat.DRIVER) {
      if (!mp.game.vehicle.isThisModelABicycle(vehicle.model)) {
        unregisterKeyBind(HexKeyCodes.Y, toggleVehicleEngine);
        unregisterKeyBind(HexKeyCodes.Left, toggleVehicleLeftIndicator);
        unregisterKeyBind(HexKeyCodes.Right, toggleVehicleRightIndicator);
      }

      unregisterKeyBind(HexKeyCodes.Y, toggleVehicleMenu);
      toggleVehicleHud(false);

      const vehicleUpdate: IVehicleUpdateData = {
        vehicleId: vehicle.remoteId,
        mileage: currentMileage,
        fuel: currentFuel
      };

      triggerServer(ProcedureKey.SERVER_PLAYER_UPDATE_VEHICLE_DATA, vehicleUpdate);

      currentMileage = 0.0;
      currentFuel = 0;
      lastVehiclePosition = null;
    }
  }
}

function toggleVehicleDoor(vehicle: VehicleMp, index: RageEnums.Vehicle.DoorIndex, toggle: boolean, immediate = false) {
  if (!mp.game.vehicle.getIsDoorValid(vehicle.handle, index))
    return;

  if (toggle) {
    vehicle.setDoorOpen(index, false, immediate);
  } else {
    vehicle.setDoorShut(index, immediate);
  }
}

function vehicleStreamInHandler(entity: VehicleMp) {
  if (entity.type != RageEnums.EntityType.VEHICLE)
    return;

  const vehicle = entity as VehicleMp;

  if (vehicle.getVariable(VehicleSharedDataType.Engine))
    vehicle.setEngineOn(true, true, true);

  toggleVehicleDoor(vehicle, RageEnums.Vehicle.DoorIndex.TRUNK, vehicle.getVariable<boolean>(VehicleSharedDataType.Trunk), true);
  toggleVehicleDoor(vehicle, RageEnums.Vehicle.DoorIndex.HOOD, vehicle.getVariable<boolean>(VehicleSharedDataType.Hood), true);

  const windows = vehicle.getVariable(VehicleSharedDataType.Windows);
  if (windows)
    handleVehicleWindows(vehicle, windows);

  const indicators = vehicle.getVariable(VehicleSharedDataType.Indicators);
  if (indicators)
    handleVehicleIndicators(vehicle, indicators);
}

function handleVehicleWindows(vehicle: VehicleMp, value: boolean[]) {
  if (mp.game.vehicle.isThisModelABicycle(vehicle.model) || mp.game.vehicle.isThisModelABike(vehicle.model))
    return;

  value.forEach((currentValue, index) => {
    if (isValidVehicleWindow(vehicle, index)) {
      if (currentValue) {
        vehicle.rollDownWindow(index);
      } else {
        vehicle.rollUpWindow(index);
      }
    }
  });
}

function vehicleWindowDataHandler(vehicle: VehicleMp, value: boolean[], _oldValue?: boolean[]) {
  if (vehicle.type != RageEnums.EntityType.VEHICLE)
    return;

  handleVehicleWindows(vehicle, value);
}

function handleVehicleIndicators(vehicle: VehicleMp, value: [boolean, boolean]) {
  const [right, left] = value;
  vehicle.setIndicatorLights(VehicleIndicator.Left, left);
  vehicle.setIndicatorLights(VehicleIndicator.Right, right);
}

function vehicleIndicatorDataHandler(vehicle: VehicleMp, value: [boolean, boolean], _oldValue?: [boolean, boolean]) {
  if (vehicle.type != RageEnums.EntityType.VEHICLE)
    return;

  handleVehicleIndicators(vehicle, value);
}

function vehicleTrunkDataHandler(vehicle: VehicleMp, value: boolean, oldValue: boolean | undefined) {
  if (vehicle.type != RageEnums.EntityType.VEHICLE)
    return;

  if (oldValue == undefined)
    return;

  toggleVehicleDoor(vehicle, RageEnums.Vehicle.DoorIndex.TRUNK, value, false);
}


function vehicleHoodDataHandler(vehicle: VehicleMp, value: boolean, oldValue: boolean | undefined) {
  if (vehicle.type != RageEnums.EntityType.VEHICLE)
    return;

  if (oldValue == undefined)
    return;

  toggleVehicleDoor(vehicle, RageEnums.Vehicle.DoorIndex.HOOD, value, false);
}



function toggleVehicleCompartmentHandler() {
  if (mp.players.local.vehicle)
    return;

  if (!mp.vehicles.length)
    return;

  const [closestVehicle] = mp.vehicles.getClosest(mp.players.local.position, 1);

  if (!closestVehicle)
    return;

  let selectedBoneIndex: string | null = null;

  if (isNearTrunk(closestVehicle)) {
    selectedBoneIndex = RageEnums.Vehicle.Bones.BOOT;
  }

  if (isNearHood(closestVehicle)) {
    selectedBoneIndex = RageEnums.Vehicle.Bones.BONNET;
  }

  if (selectedBoneIndex === null) return;

  const eventName = selectedBoneIndex === RageEnums.Vehicle.Bones.BOOT
    ? ProcedureKey.SERVER_VEHICLE_TOGGLE_TRUNK
    : ProcedureKey.SERVER_VEHICLE_TOGGLE_HOOD;

  triggerServer(eventName, closestVehicle);
}


export const isNearAnyOpenedTrunk = () => {
  if (!mp.vehicles.length)
    return false;

  const [closestVehicle] = mp.vehicles.getClosest(mp.players.local.position, 1);

  if (!closestVehicle)
    return false;

  return isNearTrunk(closestVehicle) && isVehicleTrunkOpened(closestVehicle) ? closestVehicle : false;
};


function getVehicleStatsHandler(model: string): IVehicleStats | undefined {
  const hash = mp.game.joaat(model);
  if (isVehicleModelValid(hash)) {
    return {
      maxSpeed: getVehicleMaxSpeed(hash),
      className: getVehicleClassName(hash),
      displayName: getVehicleDisplayName(hash),
      maxNumberOfPassengers: getVehicleMaxNumberOfPassengers(hash),
      acceleration: getVehicleAcceleration(hash),
      maxBraking: getVehicleMaxBraking(hash),
      maxTraction: getVehicleModelMaxTraction(hash)
    };
  }
}

registerKeyBind(HexKeyCodes.Y, true, toggleVehicleCompartmentHandler, 0, [getIsSpawned, getIsAlive, getIsNotCuffed]);

mp.events.addDataHandler(VehicleSharedDataType.Windows, vehicleWindowDataHandler);
mp.events.addDataHandler(VehicleSharedDataType.Indicators, vehicleIndicatorDataHandler);
mp.events.addDataHandler(VehicleSharedDataType.Trunk, vehicleTrunkDataHandler);
mp.events.addDataHandler(VehicleSharedDataType.Hood, vehicleHoodDataHandler);

mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler,
  playerLeaveVehicle: playerLeaveVehicleHandler,
  entityStreamIn: vehicleStreamInHandler
});

register(ProcedureKey.CLIENT_GET_VEHICLE_STATS, getVehicleStatsHandler);
