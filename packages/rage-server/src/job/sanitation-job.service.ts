import { t } from 'i18next';
import { Types } from 'mongoose';
import { triggerClient } from '@libertymp/rage-rpc';
import {
  AnimationFlag, formatCurrency, JobKey,
  PlayerAttachmentTypeEnum,
  PlayerSharedDataType,
  ProcedureKey,
  PropertyPointType
} from '@revolt-rp/common';
import { playerAddAttachment, playerRemoveAttachment } from '../player/util/player-attachment.util';
import { notifyPlayer } from '../player/util/player-notify.util';
import { getPropertyById } from '../property/property.service';
import { playAnimation } from '../player/util/player-animation.util';
import { economyConfig } from '../economy/economy.config';


const COLLECTED_TRASH: Map<number, Date> = new Map();
const TRASH_COOLDOWN = 10 * 60 * 1000; // 10 minutes
const MAX_TRASH_LOAD = 130;

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
  const min = 5;
  const max = 15;

  let weight = Math.floor(Math.random() * (max - min + 1)) + min;
  const currentLoad = vehicle.info.load || 0;

  const remainingCapacity = MAX_TRASH_LOAD - currentLoad;

  if (remainingCapacity <= 0) {
    notifyPlayer(player, { severity: 'error', detail: t('trash_truck_full') });
    return;
  }

  if (weight > remainingCapacity) {
    weight = remainingCapacity;
  }

  vehicle.info.load += weight;

  playAnimation(player, 'anim@narcotics@trash', 'drop_front', AnimationFlag.UPPER_BODY_ONLY);
  playerRemoveAttachment(player, PlayerAttachmentTypeEnum.HoldBinBag);
  player.setVariable(PlayerSharedDataType.HoldingGarbage, false);

  if (currentLoad + weight >= MAX_TRASH_LOAD) {
    const property = await getPropertyById((<Types.ObjectId>player.character.job.property).toString());

    if (property) {
      const deliveryPoint = property.points.find(point => point.type === PropertyPointType.DeliveryPoint);
      if (deliveryPoint) {
        notifyPlayer(player, { severity: 'warn', detail: t('deliver_trash') });
        triggerClient(player, ProcedureKey.CLIENT_CREATE_CHECKPOINT, deliveryPoint.position);
      }
    }
  }

  notifyPlayer(player, {
    severity: 'success',
    detail: t('trash_loaded', { weight, load: vehicle.info.load, max: MAX_TRASH_LOAD })
  });
};


export const deliverGarbage = async (player: PlayerMp, vehicle: VehicleMp) => {
  if (!vehicle.info.load)
    return notifyPlayer(player, { severity: 'error', detail: t('trash_truck_empty') });

  const weight = vehicle.info.load;

  const property = await getPropertyById((<Types.ObjectId>player.character.job.property).toString());

  if (!property)
    return notifyPlayer(player, { severity: 'error', detail: t('property_not_found') });

  const jobConfig = economyConfig.jobs[JobKey.Sanitation];
  let salary = jobConfig.baseSalary;
  salary += Math.floor(weight * jobConfig.trashWeightCashOut);

  player.character.paycheck = (player.character.paycheck + salary);
  await player.character.save();

  notifyPlayer(player, {
    severity: 'success',
    detail: t('trash_delivered', { weight, salary: formatCurrency(salary) })
  });

  property.job.stopJob(player, true);
};
