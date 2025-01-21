import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { saveVehicle } from './vehicle.service';

function playerEnterVehicleHandler(player: PlayerMp, vehicle: VehicleMp, seat: RageEnums.VehicleSeat) {
  if (seat == RageEnums.VehicleSeat.DRIVER) {


    saveVehicle(vehicle);
  }
}

function playerExitVehicleHandler(player: PlayerMp, vehicle: VehicleMp, seat: number) {

}

function playerToggleVehicleEngine(params: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = player.vehicle;

  // TODO: Check has keys

  if (vehicle && player.seat === RageEnums.VehicleSeat.DRIVER) {
    vehicle.engine = !vehicle.engine;
  }
}

mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler,
  playerExitVehicle: playerExitVehicleHandler
});

on(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_ENGINE, playerToggleVehicleEngine);
