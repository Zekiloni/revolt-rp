import { registerKeyBind, unregisterKeyBind } from '../core/keybind-manager';
import { HexKeyCodes, ProcedureKey } from '@revolt-rp/common';
import { triggerServer } from '@libertymp/rage-rpc';

const VEHICLE_ENGINE_TOGGLE_HOLD_TIME = 2000;

function toggleVehicleEngine() {
  const vehicle = mp.players.local.vehicle;

  if (vehicle && vehicle.getPedInSeat(RageEnums.VehicleSeat.DRIVER) === mp.players.local.handle) {
    triggerServer(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_ENGINE);
  }
}

function playerEnterVehicleHandler(vehicle: VehicleMp, seat: number) {
  if (vehicle && seat == RageEnums.VehicleSeat.DRIVER) {
    mp.game.vehicle.defaultEngineBehaviour = false;
    mp.players.local.setConfigFlag(241, true); // Disable player attempts to run engine causing glitch
    mp.players.local.setConfigFlag(429, true); // Disable turning off the engine when exiting a vehicle

    registerKeyBind(HexKeyCodes.E, true, toggleVehicleEngine, VEHICLE_ENGINE_TOGGLE_HOLD_TIME);
  }
}

function playerLeaveVehicleHandler(vehicle: VehicleMp, seat: number) {
  if (vehicle && seat == RageEnums.VehicleSeat.DRIVER) {
    unregisterKeyBind(HexKeyCodes.E, true, toggleVehicleEngine);
  }
}

mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler,
  playerLeaveVehicle: playerLeaveVehicleHandler
});
