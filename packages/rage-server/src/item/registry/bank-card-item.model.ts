import { ItemType, PlayerAttachmentTypeEnum, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { BaseItem } from './base-item.model';
import { Item } from '../item.model';
import { triggerClient } from '@libertymp/rage-rpc';
import { playerAddAttachment, playerRemoveAttachment } from '../../player/util/player-attachment.util';


export class BankCardItem extends BaseItem {
  holType = PlayerAttachmentTypeEnum.HoldBankCard;

  constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.CREDIT_CARD, ...type], weight);
  }

  select(player: PlayerMp, item: Item): void {
    playerAddAttachment(player, this.holType);
    player.setVariable(PlayerSharedDataType.ClickToUse, true);
  }

  deselect(player: PlayerMp, item: Item) {
    playerRemoveAttachment(player, this.holType);
    player.setVariable(PlayerSharedDataType.ClickToUse, false);
  }

  use(player: PlayerMp, item: Item): void {
    triggerClient(player, ProcedureKey.CLIENT_PLAYER_USE_BANK_CARD, item);
  }
}
