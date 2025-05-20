import { GameUiKey, VehicleSharedDataType } from '@revolt-rp/common';
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
