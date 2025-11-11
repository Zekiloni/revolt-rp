import dayjs from 'dayjs';
import { triggerClient } from '@libertymp/rage-rpc';
import {
  ISelectableUsableItem,
  ItemType,
  PlayerAttachmentTypeEnum,
  PlayerSharedDataType,
  ProcedureKey
} from '@revolt-rp/common';
import { BaseItem, Item } from '@revolt-rp/core';
import { playerAddAttachment, playerRemoveAttachment } from '../../player/util/player-attachment.util';


export class BankCardItem extends BaseItem implements ISelectableUsableItem<PlayerMp, Item> {
  holType = PlayerAttachmentTypeEnum.HoldBankCard;

  constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.BANK_CARD, ...type], weight);
  }

  select(player: PlayerMp, item: Item) {
    playerAddAttachment(player, this.holType);
    player.setVariable(PlayerSharedDataType.ClickToUse, true);
  }

  deselect(player: PlayerMp, item: Item) {
    playerRemoveAttachment(player, this.holType);
    player.setVariable(PlayerSharedDataType.ClickToUse, false);
  }

  async use(player: PlayerMp, item: Item) {
    if (item.expiringAt && dayjs(item.expiringAt).isBefore(dayjs())) {
      item.bankCardInfo.active = false;
      await item.save();
    }

    triggerClient(player, ProcedureKey.CLIENT_PLAYER_USE_BANK_CARD, item);
  }
}
