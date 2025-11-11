import { PlayerAttachmentTypeEnum, PlayerSharedDataType } from '@revolt-rp/common';
import { playerAttachmentConfig } from '../player-attachment.config';
import { disablePlayerControl, enablePlayerControl } from '../util/player-control.util';


const attachedObjects: ObjectMp[] = [];

export const hasPlayerAttachment = (player: PlayerMp, attachmentType: PlayerAttachmentTypeEnum) => {
  const attachmentConfig = playerAttachmentConfig[attachmentType];
  if (!attachmentConfig) return false;

  const playerAttachments = player.getVariable<PlayerAttachmentTypeEnum[] | undefined>(PlayerSharedDataType.Attachments);
  if (!playerAttachments || !Array.isArray(playerAttachments)) {
    return false;
  }

  return playerAttachments.includes(attachmentType);
}

async function handlePlayerAttachment(player: PlayerMp, attachmentType: PlayerAttachmentTypeEnum, isAdding: boolean) {
  if (!playerAttachmentConfig[attachmentType]) return;

  const attachmentConfig = playerAttachmentConfig[attachmentType];

  if (isAdding) {
    if (!mp.game.streaming.isModelValid(mp.game.joaat(attachmentConfig.model)))
      return;

    const object = mp.objects.new(mp.game.joaat(attachmentConfig.model), player.position);

    while (!mp.game.entity.isAnEntity(object.handle)) {
      await mp.game.waitAsync(0);
    }

    object.attachTo(
      player.handle,
      player.getBoneIndex(attachmentConfig.boneId),
      attachmentConfig.position.x,
      attachmentConfig.position.y,
      attachmentConfig.position.z,
      attachmentConfig.rotation.x,
      attachmentConfig.rotation.y,
      attachmentConfig.rotation.z,
      true,
      true,
      false,
      false,
      1,
      attachmentConfig.fixedRot
    );

    attachedObjects.push(object);

    if (attachmentConfig.disableControls && player.id === mp.players.local.id) {
      disablePlayerControl(attachmentConfig.disableControls);
    }
  } else {
    const object = attachedObjects.find(
      _object => _object.model === mp.game.joaat(attachmentConfig.model) && _object.isAttachedTo(player.handle)
    );

    if (object && mp.objects.exists(object)) {
      object.destroy();

      const idx = attachedObjects.indexOf(object);
      if (idx !== -1) {
        attachedObjects.splice(idx, 1);
      }
    }

    if (attachmentConfig.disableControls && mp.players.local.id === player.id) {
      enablePlayerControl(attachmentConfig.disableControls);
    }
  }
}

async function handlePlayerAttachments(player: PlayerMp, attachments: PlayerAttachmentTypeEnum[], oldValue?: PlayerAttachmentTypeEnum[]) {
  if (oldValue) {
    for (const model of oldValue) {
      if (!attachments.includes(model)) {
        await handlePlayerAttachment(player, model, false);
      }
    }
  }

  for (const model of attachments) {
    if (!oldValue || !oldValue.includes(model)) {
      await handlePlayerAttachment(player, model, true);
    }
  }
}

async function playerAttachmentsDataHandler(player: PlayerMp, value: PlayerAttachmentTypeEnum[], oldValue?: PlayerAttachmentTypeEnum[]) {
  if (player.type !== RageEnums.EntityType.PLAYER) return;

  await handlePlayerAttachments(player, value, oldValue);
}

async function playerAttachmentStreamInHandler(player: PlayerMp) {
  if (player.type !== RageEnums.EntityType.PLAYER) return;

  const attachments = player.getVariable<PlayerAttachmentTypeEnum[] | undefined>(PlayerSharedDataType.Attachments);

  if (attachments) {
    await handlePlayerAttachments(player, attachments, undefined);
  }
}

function playerAttachmentStreamOutHandler(player: PlayerMp) {
  if (player.type !== RageEnums.EntityType.PLAYER) return;

  const attachments = player.getVariable<PlayerAttachmentTypeEnum[] | undefined>(PlayerSharedDataType.Attachments);

  if (attachments && attachments.length) {
    attachments.forEach(attachmentType =>
      handlePlayerAttachment(player, attachmentType, false));
  }
}


mp.events.addDataHandler(PlayerSharedDataType.Attachments, playerAttachmentsDataHandler);
mp.events.add({ entityStreamIn: playerAttachmentStreamInHandler, entityStreamOut: playerAttachmentStreamOutHandler });
