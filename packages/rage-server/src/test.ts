import { EntitySharedDataType, GameUiKey, ISound3D, VehicleSharedDataType } from '@revolt-rp/common';
import { registerCommand } from './player/player-command.service';
import { showPlayerGameInterface } from './player/util/player.util';

registerCommand({
  name: 'mdc',
  description: 'test mdc',
  handle(player: PlayerMp, ...args) {
    showPlayerGameInterface(player, GameUiKey.MDC);
  }
});

registerCommand({
  name: 'alpr',
  description: 'test alpr cmd',
  handle(player: PlayerMp, ...args) {
    const vehicle = player.vehicle;
    if (!vehicle) return;
    const alpr = vehicle.getVariable<boolean | undefined>(VehicleSharedDataType.PlateRecognition) || false;
    vehicle.setVariable(VehicleSharedDataType.PlateRecognition, !alpr);
  }
});


registerCommand({
  name: 'play3d',
  description: 'test command',
  handle(player: PlayerMp, ...args) {
    const [url] = args;
    if (!url) {
      player.outputChatBox('Usage: /play3d <url>');
      return;
    }

    if (player.vehicle) {
      const sound: ISound3D = {
        id: `vehicle_${player.vehicle.id}`,
        url,
        volume: 1,
        range: 60,
        paused: false
      };
      player.vehicle.setVariable(EntitySharedDataType.SOUND, sound);
    }
  }
});

registerCommand({
  name: 'stop3d',
  description: 'test command',
  handle(player: PlayerMp, ...args) {
    if (player.vehicle) {
      player.vehicle.setVariable(EntitySharedDataType.SOUND, null);
    }
  }
});
