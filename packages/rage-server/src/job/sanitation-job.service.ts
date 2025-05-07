import { t } from 'i18next';
import { PlayerAttachmentTypeEnum, PlayerSharedDataType, ProcedureKey, PropertyPointType } from '@revolt-rp/common';
import { playerAddAttachment, playerRemoveAttachment } from '../player/util/player-attachment.util';
import { notifyPlayer } from '../player/util/player-notify.util';
import { getPropertyById } from '../property/property.service';
import { Types } from 'mongoose';
import { triggerClient } from '@libertymp/rage-rpc';


const COLLECTED_TRASH: Map<number, Date> = new Map();
const TRASH_COOLDOWN = 10 * 60 * 1000; // 10 minutes

export const collectGarbage = (player: PlayerMp, objectHandle: number) => {
  const now = new Date();
  const lastCollected = COLLECTED_TRASH.get(objectHandle);

  if (lastCollected && now.getTime() - lastCollected.getTime() < TRASH_COOLDOWN) {
    const cooldown = Math.ceil((TRASH_COOLDOWN - (now.getTime() - lastCollected.getTime())) / 1000);
    return notifyPlayer(player, { severity: 'error', detail: t('trash_already_collected', { time: cooldown }) });
  }

  COLLECTED_TRASH.set(objectHandle, now);

  playerAddAttachment(player, PlayerAttachmentTypeEnum.HoldBinBag);
  player.setVariable(PlayerSharedDataType.HoldingGarbage, true);
};


export const loadGarbage = async (player: PlayerMp, vehicle: VehicleMp) => {
  if (vehicle.info.load === undefined) {
    vehicle.info.load = 1;
  } else {
    playerRemoveAttachment(player, PlayerAttachmentTypeEnum.HoldBinBag);
    player.setVariable(PlayerSharedDataType.HoldingGarbage, false);

    if (vehicle.info.load >= 3 - 1) {
      player.notify('~r~The truck is full!');

      const property = await getPropertyById((<Types.ObjectId>player.character.job.property).toString());

      if (property) {
        const deliveryPoint = property.points.find(point => point.type === PropertyPointType.DeliveryPoint);
        if (deliveryPoint) {
          player.notify('~g~Go to the recycling center to unload the trash!');
          triggerClient(player, ProcedureKey.CLIENT_CREATE_CHECKPOINT, deliveryPoint.position);
        }
      }
    }

    vehicle.info.load += 1;
  }

  player.notify('~g~You loaded the trash into the truck!');
};

