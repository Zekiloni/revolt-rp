import { registerCommand } from '../player-command.service';


// TODO: add admin
registerCommand({
  name: 'veh',
  description: 'temporary veh',
  params: ['model', 'primary color', 'secondary color'],
  handle(player: PlayerMp, model: string, primaryColor: string, secondaryColor: string) {
    const vehicle = mp.vehicles.new(mp.joaat(model), player.position);
    vehicle.setColor(parseInt(primaryColor), parseInt(secondaryColor));
    player.putIntoVehicle(vehicle, RageEnums.VehicleSeat.DRIVER);
  }
});
