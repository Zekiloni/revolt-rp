import { BaseItem } from '../base-item.model';
import { Item } from '../../item.model';
import { GameUiKey, IHandheldRadioConfig, ItemType, ProcedureKey } from '@revolt-rp/common';
import { triggerBrowsers, triggerClient } from '@libertymp/rage-rpc';

const DEFAULT_HANDHELD_RADII_CONFIG: IHandheldRadioConfig = {
  frequency: null,
  isConnected: false,
  power: false,
  simplex: undefined
}

export class HandheldRadioItem extends BaseItem {

  constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.DEVICE_HANDHELD_RADIO, ...type], weight);
  }

  select(player: PlayerMp, item: Item) {
    if (!item.radioConfig)
      item.radioConfig = DEFAULT_HANDHELD_RADII_CONFIG;

    triggerClient(player, ProcedureKey.CLIENT_PLAYER_SHOW_INTERFACE, GameUiKey.HandheldRadio);
    triggerBrowsers(player, ProcedureKey.BROWSER_SET_HANDHELD_RADIO, item.radioConfig);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deselect(player: PlayerMp, _item: Item) {
    triggerClient(player, ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.HandheldRadio);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(_player: PlayerMp, _item: Item) {
    throw new Error('Method not implemented.');
  }
}
