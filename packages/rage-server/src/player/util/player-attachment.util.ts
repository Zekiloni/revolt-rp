import { PlayerSharedDataType } from '@revolt-rp/common';


export const playerGetAttachments = (player: PlayerMp) => {
  const attachments: string[] | undefined = player.getVariable(PlayerSharedDataType.Attachments);

  if (!attachments || !Array.isArray(attachments)) {
    player.setVariable(PlayerSharedDataType.Attachments, []);
    return [];
  }

  return attachments;
};


export function playerAddAttachment(player: PlayerMp, model: string) {
  if (playerHasAttachment(player, model) == false) {
    const attachments = player.getVariable(PlayerSharedDataType.Attachments) as string[];
    attachments.push(model);

    player.setVariable(PlayerSharedDataType.Attachments, attachments);
  }
}


export const playerHasAttachment = (player: PlayerMp, model: string) => {
  const playerAttachments: string[] | undefined = player.getVariable(PlayerSharedDataType.Attachments);

  if (!playerAttachments || Array.isArray(playerAttachments) == false) {
    player.setVariable(PlayerSharedDataType.Attachments, []);
    return false;
  }

  return playerAttachments.indexOf(model) != -1;
};


export function playerRemoveAttachment(player: PlayerMp, model: string) {
  if (playerHasAttachment(player, model)) {
    const attachments = playerGetAttachments(player);

    const idx = attachments.indexOf(model);
    if (idx != -1) {
      attachments?.splice(idx, 1);
    }

    player.setVariable(PlayerSharedDataType.Attachments, attachments);
  }
}
