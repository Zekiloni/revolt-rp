import { triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import {
  GameUiKey,
  HexKeyCodes,
  ProcedureKey,
  VehicleSharedDataType,
  IVehicleHudUpdate,
  IVehicleUpdateData
} from '@revolt-rp/common';
import { registerKeyBind, unregisterKeyBind } from '../core/keybind-manager';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';

const KMH_FRACTION = 3.6;
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
  if (vehicle && seat == RageEnums.VehicleSeat.DRIVER) {
    mp.game.vehicle.defaultEngineBehaviour = false;
    mp.players.local.setConfigFlag(241, true); // Disable player attempts to run engine causing glitch
    mp.players.local.setConfigFlag(429, true); // Disable turning off the engine when exiting a vehicle

    if (vehicle.getClass() === RageEnums.Vehicle.Classes.CYCLES) {
      if (!vehicle.getIsEngineRunning())
        toggleVehicleEngine();

      return;
    }

    currentMileage = vehicle.getVariable(VehicleSharedDataType.Mileage) || 0.00;
    currentFuel = vehicle.getVariable(VehicleSharedDataType.Fuel) || 0;

    registerKeyBind(HexKeyCodes.Y, false, toggleVehicleEngine, VEHICLE_ENGINE_TOGGLE_HOLD_TIME);
    showGameInterface(GameUiKey.VehicleHud);
    mp.events.add('render', updateVehicleHud);
  }
}

function playerLeaveVehicleHandler(vehicle: VehicleMp, seat: number) {
  if (vehicle && seat == RageEnums.VehicleSeat.DRIVER) {
    unregisterKeyBind(HexKeyCodes.Y, toggleVehicleEngine);

    hideGameInterface(GameUiKey.VehicleHud);
    mp.events.remove('render', updateVehicleHud);

    // TODO: send to the server & save vehicle mileage & fuel

    const vehicleUpdate: IVehicleUpdateData = {
      vehicleId: vehicle.remoteId,
      mileage: currentMileage,
      fuel: currentFuel
    }

    triggerServer(ProcedureKey.SERVER_PLAYER_UPDATE_VEHICLE_DATA, vehicleUpdate);

    currentMileage = 0.0;
    currentFuel = 0;
    lastVehiclePosition = null;
  }
}

function vehicleStreamInHandler(entity: VehicleMp) {
  if (entity.type != RageEnums.EntityType.VEHICLE)
    return;

  const vehicle = entity as VehicleMp;

  if (vehicle.getVariable(VehicleSharedDataType.Engine))
    vehicle.setEngineOn(true, true, true);
}

mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler,
  playerLeaveVehicle: playerLeaveVehicleHandler,
  entityStreamIn: vehicleStreamInHandler
});
