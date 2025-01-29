import { PlayerAttachmentTypeEnum, PlayerSharedDataType } from '@revolt-rp/common';


export const playerGetAttachments = (player: PlayerMp) => {
  const attachments: PlayerAttachmentTypeEnum[] | undefined = player.getVariable(PlayerSharedDataType.Attachments);

  if (!attachments || !Array.isArray(attachments)) {
    player.setVariable(PlayerSharedDataType.Attachments, []);
    return [];
  }

  return attachments;
};


export function playerAddAttachment(player: PlayerMp, attachment: PlayerAttachmentTypeEnum) {
  if (playerHasAttachment(player, attachment) == false) {
    const attachments = player.getVariable<PlayerAttachmentTypeEnum[] | undefined>(PlayerSharedDataType.Attachments) ?? [];
    attachments.push(attachment);

    player.setVariable(PlayerSharedDataType.Attachments, attachments);
  }
}


export const playerHasAttachment = (player: PlayerMp, attachment: PlayerAttachmentTypeEnum) => {
  const playerAttachments = player.getVariable<PlayerAttachmentTypeEnum[] | undefined>(PlayerSharedDataType.Attachments);

  if (!playerAttachments || Array.isArray(playerAttachments) == false) {
    player.setVariable(PlayerSharedDataType.Attachments, []);
    return false;
  }

  return playerAttachments.indexOf(attachment) != -1;
};


export function playerRemoveAttachment(player: PlayerMp, attachment: PlayerAttachmentTypeEnum) {
  if (playerHasAttachment(player, attachment)) {
    const attachments = playerGetAttachments(player);

    const idx = attachments.indexOf(attachment);
    if (idx != -1) {
      attachments?.splice(idx, 1);
    }

    player.setVariable(PlayerSharedDataType.Attachments, attachments);
  }
}
