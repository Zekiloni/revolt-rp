import { registerCommand } from '../player/player-command.service';
import { isPlayerInVehicleCommandValidator } from './vehicle.util';
import { hasPlayerVehicleKeys, toggleVehicleEngine, toggleVehicleWindow } from './vehicle.service';
import { sendInfoMessage } from '../player/util/player-notify.util';


registerCommand({
  name: 'engine',
  description: 'todo',
  validators: [isPlayerInVehicleCommandValidator],
  handle(player: PlayerMp) {
    if (hasPlayerVehicleKeys(player, player.vehicle)) {
      // TODO: auto ame
      toggleVehicleEngine(player.vehicle);
    }
  }
});


registerCommand({
  name: 'windows',
  description: 'todo',
  params: ['index'],
  validators: [isPlayerInVehicleCommandValidator],
  handle(player: PlayerMp, index: string) {
    if (isNaN(parseInt(index)))
      return;

    // TODO: auto ame
    toggleVehicleWindow(player.vehicle, parseInt(index));
  }
});


registerCommand({
  name: 'lastvehicle',
  aliases: ['lv', 'lastveh'],
  description: 'todo',
  handle(player: PlayerMp) {
    const vehicle = player.lastVehicle;
    if (vehicle && mp.vehicles.exists(vehicle)) {
      sendInfoMessage(
        player,
        `vID: ${vehicle.id}, vModel: ${vehicle.info ? vehicle.info.model : 'N/A'}, vDB-ID ${vehicle.info ? vehicle.info.id : 'N/A'}`
      );
    }
  }
});
