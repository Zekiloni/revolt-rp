import { BaseItem } from './base-item.model';
import { ItemType } from '@bcrp-rage/common';
import { Item } from '../item.model';


export class WeaponItem extends BaseItem {
  weaponModel: string;

  constructor(name: string, description: string, weaponModel: string, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.WEAPON, ...type], weight);
    this.weaponModel = weaponModel;
  }

  select(player: PlayerMp, item: Item): void {
    player.giveWeapon(mp.joaat(this.weaponModel), item.ammoInClip ?? 0);
  }

  deselect(player: PlayerMp, item: Item) {
    player.removeWeapon(mp.joaat(this.weaponModel));
  }

  use(player: PlayerMp, item: Item): void {
    item.ammoInClip --;
  }

}
