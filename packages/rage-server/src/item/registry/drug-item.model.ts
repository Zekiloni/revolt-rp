import { triggerClient } from '@libertymp/rage-rpc';
import { BaseItem, Item } from '@revolt-rp/core';
import {
  AddictionType, IDrugConfig,
  IDrugEffect, ISelectableUsableItem,
  ItemType, PlayerSharedDataType,
  ProcedureKey
} from '@revolt-rp/common';
import { getAddictionTolerance } from '../../player/character/character.service';
import { playerRemoveItemFromInventory } from '../../player/inventory/player-inventory.service';


export class DrugItem extends BaseItem implements ISelectableUsableItem<PlayerMp, Item> {
  addiction: AddictionType;
  config: IDrugConfig;

  constructor(name: string, description: string, addiction: AddictionType, model: string, weight: number, config: IDrugConfig) {
    super(name, description, model, [ItemType.CONSUMABLE, ItemType.DRUG], weight);
    this.addiction = addiction;
    this.config = config;
  }

  async use(player: PlayerMp, item: Item): Promise<void> {
    console.log('[DrugItem] Player is using drug item:', this.name);
    const character = player.character;
    if (!character.drugs) character.drugs = [];

    console.log('[DrugItem] Drug Config:', this.config);
    const tolerance = getAddictionTolerance(character, this.addiction);
    const finalLevel = Math.max(0, this.config.intensity - tolerance);

    const existing = character.drugs.find(d => d.addictionType === this.addiction);

    if (existing) {
      existing.effectLevel += finalLevel;
      existing.duration = Math.max(existing.duration, this.config.duration);
      character.markModified('drugs');
    } else {
      const drug: IDrugEffect = {
        addictionType: this.addiction,
        effectLevel: finalLevel,
        duration: this.config.duration,
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

    const addictionIncrease = this.config.effects.find(effect => effect.type === 'addiction' && effect.amount > 0).amount || 0;
    const addiction = character.addictions.find(a => a.type === this.addiction);
    if (addiction) {
      addiction.level = Math.min(100, addiction.level + addictionIncrease * this.weight);
      addiction.lastUsedAt = new Date();
    } else {
      character.addictions.push({
        type: this.addiction,
        level: addictionIncrease * (item.quantity || 1),
        lastUsedAt: new Date()
      });
    }

    await character.save();
    console.log('[DrugItem] Player used drug:', this.name, 'Final Level:', finalLevel, 'Duration:', this.config.duration);
    triggerClient(player, ProcedureKey.CLIENT_DRUG_USE_EFFECT, [this.addiction, finalLevel, this.config.duration]);
  }

  deselect(player: PlayerMp, item: Item): void {
    player.setVariable(PlayerSharedDataType.ClickToUse, false);
  }

  select(player: PlayerMp, item: Item): void {
    player.setVariable(PlayerSharedDataType.ClickToUse, true);
  }

}
