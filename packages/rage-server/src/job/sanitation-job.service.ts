import { PlayerAttachmentTypeEnum, PlayerSharedDataType } from '@revolt-rp/common';
import { playerAddAttachment, playerRemoveAttachment } from '../player/util/player-attachment.util';


const COLLECTED_TRASH: Map<number, Date> = new Map();
const TRASH_COOLDOWN = 10 * 60 * 1000; // 10 minutes

export const collectGarbage = (player: PlayerMp, objectHandle: number) => {
  const now = new Date();
  const lastCollected = COLLECTED_TRASH.get(objectHandle);

  if (lastCollected && now.getTime() - lastCollected.getTime() < TRASH_COOLDOWN) {
    player.notify('~r~You need to wait before collecting this trash again.');
    return;
  }

  COLLECTED_TRASH.set(objectHandle, now);

  playerAddAttachment(player, PlayerAttachmentTypeEnum.HoldBinBag);
  player.setVariable(PlayerSharedDataType.HoldingGarbage, true);
  player.notify('~g~You collected the trash!');
};


export const loadGarbage = (player: PlayerMp, vehicle: VehicleMp) => {
  if (vehicle.info.load === undefined) {
    vehicle.info.load = 0;
  } else {
    if (vehicle.info.load >= 10) {
      player.notify('~r~The truck is full!');
      return;
    }

    vehicle.info.load += 1;
  }

  player.setVariable(PlayerSharedDataType.HoldingGarbage, false);
  playerRemoveAttachment(player, PlayerAttachmentTypeEnum.HoldBinBag);
  player.notify('~g~You loaded the trash into the truck!');
};

