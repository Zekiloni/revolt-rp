import { IBaseItem, ItemType, IItem } from '@bcrp-rage/common';

export const itemRegistry: Map<string, BaseItem> = new Map();

export abstract class BaseItem implements IBaseItem {
  description: string;
  model: string;
  name: string;
  type: ItemType[];
  weight: number;

  abstract select(player: PlayerMp, item: IItem): void;

  deselect?(player: PlayerMp, item: IItem): void;

  abstract use(player: PlayerMp, item: IItem): void;

  stopUse?(player: PlayerMp, item: IItem): void;

  protected constructor(name: string, description: string, model: string, type: ItemType[], weight: number) {
    this.name = name;
    this.description = description;
    this.model = model;
    this.type = type;
    this.weight = weight;

    itemRegistry.set(this.name, this);
  }
}
