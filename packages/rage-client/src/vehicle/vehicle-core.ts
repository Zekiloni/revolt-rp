import { triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { GameUiKey, HexKeyCodes, ProcedureKey, VehicleSharedDataType, VehicleHudUpdate } from '@revolt-rp/common';
import { registerKeyBind, unregisterKeyBind } from '../core/keybind-manager';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';

const KMH_FRACTION = 3.6;
const RPM_MULTIPLIER = 5000;

const VEHICLE_ENGINE_TOGGLE_HOLD_TIME = 2000;
let lastUpdate = Date.now();

function toggleVehicleEngine() {
  const vehicle = mp.players.local.vehicle;
  if (vehicle && vehicle.getPedInSeat(RageEnums.VehicleSeat.DRIVER) === mp.players.local.handle) {
    triggerServer(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_ENGINE);
  }
}

function updateVehicleHud() {
  const vehicle = mp.players.local.vehicle;

  if (vehicle) {
    // const now = Date.now();
    // if (now - lastUpdate < 100) return;
    // lastUpdate = now;

    const { lightsOn, highbeamsOn: highBeamsOn } = vehicle.getLightsState(1, 1);

    const vehicleHudUpdate: VehicleHudUpdate = {
      speed: Math.trunc(vehicle.getSpeed() * KMH_FRACTION),
      rpm: Math.trunc(vehicle.rpm * RPM_MULTIPLIER),
      gear: vehicle.gear,
      fuel: vehicle.getVariable(VehicleSharedDataType.Fuel) || 0.00,
      mileage: vehicle.getVariable(VehicleSharedDataType.Mileage) || 0.00,
      lightsOn,
      highBeamsOn
    };

    triggerBrowser(browser, ProcedureKey.BROWSER_UPDATE_VEHICLE_HUD, vehicleHudUpdate);
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

    registerKeyBind(HexKeyCodes.Y, false, toggleVehicleEngine, VEHICLE_ENGINE_TOGGLE_HOLD_TIME);
    showGameInterface(GameUiKey.VehicleHud);
    mp.events.add('render', updateVehicleHud);
  }
}

function playerLeaveVehicleHandler(vehicle: VehicleMp, seat: number) {
  if (vehicle && seat == RageEnums.VehicleSeat.DRIVER) {
    unregisterKeyBind(HexKeyCodes.E, toggleVehicleEngine);

    hideGameInterface(GameUiKey.VehicleHud);
    mp.events.remove('render', updateVehicleHud);
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
  entityStreamIn: vehicleStreamInHandler,
});
