import { ItemType, PlayerAttachmentTypeEnum, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { playerAddAttachment, playerRemoveAttachment } from '../../../player/util/player-attachment.util';
import { BaseItem } from '../base-item.model';
import { Item } from '../../../../../core/src/lib/persistence/model/item.model';
import { callClient } from '@libertymp/rage-rpc';
import { setCuffed } from '../../../player/character/character.service';


export class CuffItem extends BaseItem {

  constructor() {
    super('items.cuffs', 'items.cuffs_description', 'p_cs_cuffs_02_s', [ItemType.UTILITY], 0.2);
  }

  select(player: PlayerMp, item: Item) {
    playerAddAttachment(player, PlayerAttachmentTypeEnum.HoldCuffs);
    player.setVariable(PlayerSharedDataType.ClickToUse, true);
    player.setVariable(PlayerSharedDataType.HighlightTarget, true);
  }

  async use(player: PlayerMp, item: Item) {
    const target = await callClient<PlayerMp | null>(player, ProcedureKey.CLIENT_GET_HIGHLIGHT_TARGET);

    if (!target) {
      return;
    }

    if (player.dist(target.position) > 1.7)
      return;

    const isCuffed = target.character.isCuffed || false;
    setCuffed(target, !isCuffed);

    if (!isCuffed)
      item.quantity -= 1;
  }

  deselect(player: PlayerMp, item: Item) {
    playerRemoveAttachment(player, PlayerAttachmentTypeEnum.HoldCuffs);
    player.setVariable(PlayerSharedDataType.ClickToUse, false);
    player.setVariable(PlayerSharedDataType.HighlightTarget, false);
  }
}
