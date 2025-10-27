import { BaseItem } from './base-item.model';
import { ItemType, CaliberType } from '@revolt-rp/common';
import { Item } from '../../../../core/src/lib/persistence/model/item.model';


export class WeaponItem extends BaseItem {
  weaponHash: RageEnums.Hashes.Weapon;
  caliberType: CaliberType;

  constructor(name: string, description: string, weaponHash: RageEnums.Hashes.Weapon, caliberType: CaliberType, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.WEAPON, ...type], weight);
    this.weaponHash = weaponHash;
    this.caliberType = caliberType;
  }

  select(player: PlayerMp, item: Item): void {
    player.giveWeapon(this.weaponHash, item.weaponAmmo ?? 0);

    if (item.weaponAmmo)
      player.setWeaponAmmo(this.weaponHash, item.weaponAmmo ?? 0);
  }

  async deselect(player: PlayerMp, item: Item) {
    if (player.weapon != this.weaponHash)
      return;

    item.weaponAmmo = player.getWeaponAmmo(this.weaponHash);
    player.removeWeapon(this.weaponHash);
  }

  use(player: PlayerMp, item: Item): void {
    item.weaponAmmo--;
  }
}
