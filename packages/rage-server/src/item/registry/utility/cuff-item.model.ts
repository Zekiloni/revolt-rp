import { ItemType, PlayerAttachmentTypeEnum, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { playerAddAttachment, playerRemoveAttachment } from '../../../player/util/player-attachment.util';
import { BaseItem } from '../base-item.model';
import { Item } from '../../item.model';
import { callClient } from '@libertymp/rage-rpc';
import { setCuffed } from '../../../player/character/character.service';


export class CuffItem extends BaseItem {

  constructor() {
    super('items.cuffs', 'items.cuffs_description', 'p_cs_cuffs_02_s', [ItemType.UTILITY], 0.2);
  }

  select(player: PlayerMp, item: Item) {
    playerAddAttachment(player, PlayerAttachmentTypeEnum.HoldCuffs);
    player.setVariable(PlayerSharedDataType.HighlightTarget, true);
  }

  async use(player: PlayerMp, item: Item) {
    const target = await callClient<PlayerMp | null>(player, ProcedureKey.CLIENT_GET_HIGHLIGHT_TARGET);

    if (!target) {
      return;
    }

    console.log('CuffTarget', target);
    setCuffed(target, true);
  }

  deselect(player: PlayerMp, item: Item) {
    playerRemoveAttachment(player, PlayerAttachmentTypeEnum.HoldCuffs);
    player.setVariable(PlayerSharedDataType.HighlightTarget, false);
  }
}
