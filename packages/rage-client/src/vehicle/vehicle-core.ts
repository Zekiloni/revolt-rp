
function playerEnterVehicleHandler(vehicle: VehicleMp, seat: number) {
  if (vehicle && seat == -1) {
    mp.game.vehicle.defaultEngineBehaviour = false;
    mp.players.local.setConfigFlag(429, true);
  }
}

mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler
})
