import { triggerClient } from '@libertymp/rage-rpc';
import {
  ISelectableUsableItem,
  ItemType,
  PlayerAttachmentTypeEnum,
  PlayerSharedDataType,
  ProcedureKey
} from '@revolt-rp/common';
import { BaseItem, Item } from '@revolt-rp/core';
import { playerAddAttachment, playerRemoveAttachment } from '../../../player/util/player-attachment.util';

export class FishingRodItem extends BaseItem implements ISelectableUsableItem<PlayerMp, Item> {

  constructor(name: string, description: string, model: string, weight: number) {
    super(name, description, model, [ItemType.UTILITY, ItemType.MISCELLANEOUS, ItemType.FISHING_ROD], weight);
  }

  select(player: PlayerMp, item: Item): void {
    playerAddAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01);
    player.setVariable(PlayerSharedDataType.ClickToUse, true);
  }

  deselect(player: PlayerMp, item: Item) {
    playerRemoveAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01);
    player.setVariable(PlayerSharedDataType.ClickToUse, false);
  }

  use(player: PlayerMp, item: Item): void {
    triggerClient(player, ProcedureKey.CLIENT_USE_FISHING_ROD);
  }
}
