import {
  GameUiKey,
  ItemType,
  PlayerAttachmentTypeEnum,
  PlayerPhoneState,
  PlayerSharedDataType
} from '@revolt-rp/common';
import { Item } from '../../item.model';
import { BaseItem } from '../base-item.model';
import { playerAddAttachment, playerRemoveAttachment } from '../../../player/util/player-attachment.util';
import { hidePlayerGameInterface, showPlayerGameInterface } from '../../../player/util/player.util';


export class SmartphoneItemModel extends BaseItem {

  constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.DEVICE_SMARTPHONE, ...type], weight);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  select(player: PlayerMp, _item: Item) {
    player.setVariable(PlayerSharedDataType.PhoneState, PlayerPhoneState.Away);
    playerAddAttachment(player, PlayerAttachmentTypeEnum.HoldAmbPhone);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deselect(player: PlayerMp, _item: Item) {
    player.setVariable(PlayerSharedDataType.PhoneState, null);
    playerRemoveAttachment(player, PlayerAttachmentTypeEnum.HoldAmbPhone);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(player: PlayerMp, _item: Item) {
    player.setVariable(PlayerSharedDataType.PhoneState, PlayerPhoneState.Idle);
    showPlayerGameInterface(player, GameUiKey.Smartphone);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  putAway(player: PlayerMp, _item: Item) {
    hidePlayerGameInterface(player, GameUiKey.Smartphone);
    player.setVariable(PlayerSharedDataType.PhoneState, PlayerPhoneState.Away);
  }
}
