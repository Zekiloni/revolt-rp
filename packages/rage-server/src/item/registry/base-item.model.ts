import { IBaseItem, ItemType, IItem } from '@bcrp-rage/common';

const itemRegistry: Map<string, BaseItem> = new Map();

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

  constructor() {
    itemRegistry.set(this.name, this);
  }
}
