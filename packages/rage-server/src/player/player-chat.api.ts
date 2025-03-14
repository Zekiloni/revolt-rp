import { hexColors } from '@revolt-rp/common';
import { t } from 'i18next';
import { sendProximityMessage } from './util/player.util';
import { getPlayerActivePhoneCall, playerSpeakPhoneCall } from './inventory/phone/player-phone.service';

const IC_CHAT_RADIUS = 10.0;

mp.events.add({
  async playerChat(player: PlayerMp, text: string) {
    if (!player.character) return;

    const activePhoneCall = await getPlayerActivePhoneCall(player);

    if (activePhoneCall) {
      await playerSpeakPhoneCall(player, activePhoneCall, text);
      return;
    }

    const content = t('says', { person: player.name, text });
    sendProximityMessage(content, player.position, IC_CHAT_RADIUS, hexColors.WHITE_PALETTE);
  }
});
