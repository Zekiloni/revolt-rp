import { hexColors } from '@revolt-rp/common';
import { t } from 'i18next';

const adminAlertPrefix = `!{${hexColors.TOMATO}}[!]`;


export const sendAdminAlert = (message: string) => {
  mp.players.forEach((player) => {
    if (player.account && player.account.isAdmin && player.account.isAdminAlertsEnabled) {
      player.outputChatBox(`${adminAlertPrefix} ${message}`);
    }
  });
};

export const sendAdminChatMessage = (player: PlayerMp, message: string) => {
  const adminLevel = t('admin_level', { returnObjects: true }) as string[];
  mp.players.forEach((target) => {
    if (target.account && target.account.isAdmin && target.account.isAdminChatEnabled) {
      target.outputChatBox(`!{${hexColors.TOMATO}}[ADMIN] ${adminLevel} !{${hexColors.TOMATO}}${player.name}: !{${hexColors.WHITE_SMOKE}}${message}`);
    }
  });
}
