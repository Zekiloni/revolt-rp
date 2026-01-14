import { EntitySharedDataType, GameUiKey, IAudio3D, VehicleSharedDataType } from '@revolt-rp/common';
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
      const sound: IAudio3D = {
        id: `vehicle_${player.vehicle.id}`,
        url,
        volume: 1,
        range: 10,
        source: {
          type: 'vehicle',
          id: player.vehicle.id
        },
        loop: false,
        position: player.vehicle.position,
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

registerCommand({
  name: 'volume3d',
  description: 'test ui',
  handle(player: PlayerMp, ...args) {
    if (args.length < 1) {
      player.outputChatBox('Usage: /volume3d <volume 0.0 - 1.0>');
      return;
    }

    const [volumeStr] = args;
    const volume = parseFloat(volumeStr);
    if (isNaN(volume) || volume < 0 || volume > 1) {
      player.outputChatBox('Usage: /volume3d <volume 0.0 - 1.0>');
      return;
    }

    const sound = player.vehicle?.getVariable<IAudio3D | undefined>(EntitySharedDataType.SOUND);
    if (sound) {
      sound.volume = volume;
      player.vehicle!.setVariable(EntitySharedDataType.SOUND, sound);
    }
  }
})
