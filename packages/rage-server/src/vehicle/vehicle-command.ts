import { registerCommand } from '../player/player-command.service';
import { isPlayerInVehicleCommandValidator } from './vehicle.util';
import { hasPlayerVehicleKeys, toggleVehicleEngine, toggleVehicleWindow } from './vehicle.service';


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
