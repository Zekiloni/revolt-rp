import { triggerBrowsers } from '@libertymp/rage-rpc';
import { BaseItem } from './base-item.model';
import { AnimationFlag, ItemFlag, ItemType, ProcedureKey } from '@revolt-rp/common';
import { Item } from '../item.model';
import {
  playerAddAttachment,
  playerRemoveAttachment
} from '../../player/util/player-attachment.util';
import { playAnimation } from '../../player/util/player-animation.util';


export class DrinkItemModel extends BaseItem {
  volume = 3;
  alcohol?: number;

  constructor(name: string, description: string, type: ItemType[], model: string, weight: number, alcohol?: number) {
    super(name, description, model, [ItemType.CONSUMABLE, ItemType.DRINK, ...type], weight);

    if (alcohol) {
      this.alcohol = alcohol;
    }
  }

  async select(player: PlayerMp, item: Item) {
    playerAddAttachment(player, this.model);
  }

  async deselect(player: PlayerMp, item: Item) {
    playerRemoveAttachment(player, this.model);
  }

  async use(player: PlayerMp, item: Item) {
    if (item.usage <= 1) {
      item.usage = 0;
      item.flag = ItemFlag.EMPTY_BOTTLE;
      return;
    }

    item.usage -= 5;

    playAnimation(player, 'amb@world_human_drinking@beer@male@idle_a', 'idle_a', AnimationFlag.UPPER_BODY_ONLY_CONTROLLABLE);

    if (this.alcohol) {
      player.character.drunk += this.alcohol / 2;
    }

    player.character.thirst = (player.character.thirst + this.volume);

    await player.character.save();
    await item.save();

    triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_UPDATE_ITEM, item);
  }
}
