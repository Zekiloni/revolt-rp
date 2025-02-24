import { IHandheldRadioConfig, ItemType } from '@revolt-rp/common';
import { getPlayerItemByType } from './player-inventory.service';
import { Item } from '../../item/item.model';


export const getPlayerHandheldRadio = (player: PlayerMp) => {
  return getPlayerItemByType(player, ItemType.DEVICE_HANDHELD_RADIO);
};


export const updateHandheldRadio = async (item: Item, radioConfig: IHandheldRadioConfig) => {
  item.radioConfig = radioConfig;
  await item.save();
  return item.radioConfig;
};
