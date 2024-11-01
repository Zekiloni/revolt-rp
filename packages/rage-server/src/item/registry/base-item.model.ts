import { IBaseItem, ItemType } from '@bcrp-rage/common';
import { Item } from '../item.model';

export const itemRegistry: Map<string, BaseItem> = new Map();

export abstract class BaseItem implements IBaseItem {
  description: string;
  model: string;
  name: string;
  type: ItemType[];
  weight: number;

  abstract select(player: PlayerMp, item: Item): void;

  deselect?(player: PlayerMp, item: Item): void;

  abstract use(player: PlayerMp, item: Item): void;

  stopUse?(player: PlayerMp, item: Item): void;

  protected constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    this.name = name;
    this.description = description;
    this.model = model;
    this.type = type;
    this.weight = weight;

    itemRegistry.set(this.name, this);
  }
}
