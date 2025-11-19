import { triggerClient } from '@libertymp/rage-rpc';
import { BaseItem, Item } from '@revolt-rp/core';
import {
  AddictionType,
  IDrugEffect,
  ItemType,
  IUsableItem,
  ProcedureKey
} from '@revolt-rp/common';
import { getAddictionTolerance } from '../../player/character/character.service';
import { playerRemoveItemFromInventory } from '../../player/inventory/player-inventory.service';


export class DrugItem extends BaseItem implements IUsableItem<PlayerMp, Item> {
  addiction: AddictionType;
  intensity: number;
  duration: number;
  addictionIncrease = 7;
  hpLoss = 0;

  constructor(name: string, description: string, addiction: AddictionType, model: string, weight: number) {
    super(name, description, model, [ItemType.CONSUMABLE, ItemType.DRUG], weight);
    this.addiction = addiction;
  }

  async use(player: PlayerMp, item: Item): Promise<void> {
    const character = player.character;
    if (!character.drugs) character.drugs = [];

    const tolerance = getAddictionTolerance(character, this.addiction);
    const finalLevel = Math.max(0, this.intensity - tolerance);

    const existing = character.drugs.find(d => d.addictionType === this.addiction);

    if (existing) {
      existing.effectLevel += finalLevel;
      existing.duration = Math.max(existing.duration, this.duration);
      character.markModified('drugs');
    } else {
      const drug: IDrugEffect = {
        addictionType: this.addiction,
        effectLevel: finalLevel,
        duration: this.duration,
        startedAt: new Date()
      };

      character.drugs.push(drug);
    }

    item.quantity = Math.max(0, (item.quantity || 0) - this.weight);
    if (item.quantity === 0) {
      await playerRemoveItemFromInventory(player, item.id);
      return;
    } else {
      await item.save();
    }

    if (this.hpLoss > 0) {
      character.health = Math.max(0, character.health - this.hpLoss);
    }

    const addiction = character.addictions.find(a => a.type === this.addiction);
    if (addiction) {
      addiction.level = Math.min(100, addiction.level + this.addictionIncrease * this.weight);
      addiction.lastUsedAt = new Date();
    } else {
      character.addictions.push({
        type: this.addiction,
        level: this.addictionIncrease * (item.quantity || 1),
        lastUsedAt: new Date()
      });
    }

    await character.save();
    triggerClient(player, ProcedureKey.CLIENT_DRUG_USE_EFFECT, [this.addiction, finalLevel, this.duration]);
  }
}
