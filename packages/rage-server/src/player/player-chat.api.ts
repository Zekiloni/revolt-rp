import { hexColors } from '@bcrp-rage/common';
import { t } from 'i18next';
import { sendProximityMessage } from './player.util';

const IC_CHAT_RADIUS = 10.0;

mp.events.add({
  playerChat(player: PlayerMp, text: string) {
    if (!player.character) return;

    const content = t('says', { person: player.name, text });
    sendProximityMessage(content, player.position, IC_CHAT_RADIUS, hexColors.WHITE);
  }
});
