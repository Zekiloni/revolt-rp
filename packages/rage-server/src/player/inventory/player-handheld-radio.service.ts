import { hexColors, IHandheldRadioConfig, ItemType } from '@revolt-rp/common';
import { getPlayerItemByType } from './player-inventory.service';
import { Item } from '../../item/item.model';
import { notifyPlayer } from '../util/player-notify.util';
import { t } from 'i18next';
import { sendProximityMessage } from '../util/player.util';


export const radioPrefix = (frequency: string, simplex: number) =>
  `!{${hexColors.LAMBS_WOOL}}[${frequency}MHz | S${simplex}]`;


export const getPlayerHandheldRadio = (player: PlayerMp) => {
  return getPlayerItemByType(player, ItemType.DEVICE_HANDHELD_RADIO);
};


export const isActiveListener = (frequency: string, simplex: number, radio: IHandheldRadioConfig | null) => {
  if (!radio) {
    return false;
  }
  return (radio.frequency === frequency && radio.simplex === simplex) && (radio.isConnected && radio.power);
};

export const getActiveFrequencyListeners = (frequency: string, simplex: number) => {
  return mp.players.toArray().filter((player) => {
    const handheldRadio = getPlayerHandheldRadio(player);
    return handheldRadio && isActiveListener(frequency, simplex, handheldRadio.radioConfig);
  });
};

export const updateHandheldRadio = async (item: Item, radioConfig: IHandheldRadioConfig) => {
  item.radioConfig = radioConfig;
  await item.save();
  return item.radioConfig;
};


export const playerSendRadioMessage = (player: PlayerMp, message: string) => {
  const handheldRadio = getPlayerHandheldRadio(player);

  if (!handheldRadio)
    return notifyPlayer(player, {
      severity: 'error', summary: t('error'), detail: t('you_dont_have_item', {
        item: t('items.handheld_radio')
      })
    });

  if (!handheldRadio.radioConfig)
    return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('your_must_configure_radio') });

  if (!handheldRadio.radioConfig.power)
    return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('your_radio_power_off') });

  if (!handheldRadio.radioConfig.isConnected)
    return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('your_radio_not_connected') });

  const { frequency, simplex } = handheldRadio.radioConfig;

  const listeners = getActiveFrequencyListeners(frequency, simplex);

  const prefix = radioPrefix(frequency, simplex);

  sendProximityMessage(t('says_radio', {
    name: player.name,
    text: message
  }), player.position, 5.5, hexColors.WHITE_PALETTE, [player]);

  listeners.forEach((target) => {
    target.outputChatBox(`${prefix} ${player.name}: ${message}`);
  });
};
