import { saveVehicle } from './vehicle.service';

function playerEnterVehicleHandler(player: PlayerMp, vehicle: VehicleMp, seat: RageEnums.VehicleSeat) {
  if (seat == RageEnums.VehicleSeat.DRIVER) {


    saveVehicle(vehicle);
  }
}

mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler
})
