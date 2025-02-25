import { hexColors } from '@revolt-rp/common';

const adminAlertPrefix = `!{${hexColors.TOMATO}}[!]`;


export const sendAdminAlert = (message: string) => {
  mp.players.forEach((player) => {
    if (player.account && player.account.isAdmin) {
      player.outputChatBox(`${adminAlertPrefix} ${message}`);
    }
  });
};
