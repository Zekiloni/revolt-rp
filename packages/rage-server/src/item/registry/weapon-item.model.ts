import { BaseItem } from './base-item.model';
import { IItem, ItemType } from '@bcrp-rage/common';


export class WeaponItem extends BaseItem {
  weaponModel: string;

  constructor(name: string, description: string, weaponModel: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.WEAPON, ...type], weight);
    this.weaponModel = weaponModel;
  }

  select(player: PlayerMp, item: IItem): void {
  }

  use(player: PlayerMp, item: IItem): void {
  }

}
