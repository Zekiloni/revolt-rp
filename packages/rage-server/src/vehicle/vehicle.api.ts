import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IVehicleUpdateData, ProcedureKey, VehicleSharedDataType } from '@revolt-rp/common';
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
    vehicle.setVariable(VehicleSharedDataType.Engine, vehicle.engine);
  }
}

mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler,
  playerExitVehicle: playerExitVehicleHandler
});

function playerUpdateVehicleData(data: IVehicleUpdateData, { player }: ProcedureListenerInfo<PlayerMp>) {
  const vehicle = mp.vehicles.at(data.vehicleId);

  if (vehicle) {
    vehicle.setVariable(VehicleSharedDataType.Mileage, parseFloat(data.mileage.toFixed(2)));
    vehicle.setVariable(VehicleSharedDataType.Fuel, data.fuel);
  }
}

on(ProcedureKey.SERVER_PLAYER_UPDATE_VEHICLE_DATA, playerUpdateVehicleData);
on(ProcedureKey.SERVER_PLAYER_TOGGLE_VEHICLE_ENGINE, playerToggleVehicleEngine);
