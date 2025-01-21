function playerEnterVehicleHandler(vehicle: VehicleMp, seat: number) {
  if (vehicle && seat == RageEnums.VehicleSeat.DRIVER) {
    mp.game.vehicle.defaultEngineBehaviour = false;
    mp.players.local.setConfigFlag(241, true); // Disable player attempts to run engine causing glitch
    mp.players.local.setConfigFlag(429, true); // Disable turning off the engine when exiting a vehicle
  }
}

mp.events.add({
  playerEnterVehicle: playerEnterVehicleHandler
});

