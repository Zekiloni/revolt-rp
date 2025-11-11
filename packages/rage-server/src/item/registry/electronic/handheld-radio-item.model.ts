import { triggerBrowsers } from '@libertymp/rage-rpc';
import { GameUiKey, IHandheldRadioConfig, ISelectableUsableItem, ItemType, ProcedureKey } from '@revolt-rp/common';
import { hidePlayerGameInterface, showPlayerGameInterface } from '../../../player/util/player.util';
import { BaseItem, Item } from '@revolt-rp/core';


const DEFAULT_HANDHELD_RADII_CONFIG: IHandheldRadioConfig = {
  frequency: null,
  isConnected: false,
  power: false,
  simplex: undefined
};


export class HandheldRadioItemModel extends BaseItem implements ISelectableUsableItem<PlayerMp, Item> {

  constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.DEVICE_HANDHELD_RADIO, ...type], weight);
  }

  select(player: PlayerMp, item: Item) {
    if (!item.radioConfig)
      item.radioConfig = DEFAULT_HANDHELD_RADII_CONFIG;

    showPlayerGameInterface(player, GameUiKey.HandheldRadio, () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_HANDHELD_RADIO, item.radioConfig));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deselect(player: PlayerMp, _item: Item) {
    hidePlayerGameInterface(player, GameUiKey.HandheldRadio);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(_player: PlayerMp, _item: Item) {
    throw new Error('Method not implemented.');
  }
}
