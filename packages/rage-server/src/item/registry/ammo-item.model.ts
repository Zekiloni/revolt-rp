import { CaliberType, ItemType, PlayerSharedDataType } from '@revolt-rp/common';
import { BaseItem } from './base-item.model';
import { Item } from '../item.model';
import { WeaponItem } from './weapon-item.model';
import { playerRemoveItemFromInventory } from '../../player/inventory/player-inventory.service';

export class AmmoItem extends BaseItem {
  caliberType: CaliberType;

  constructor(name: string, description: string, caliberType: CaliberType, model: string, type: ItemType[], weight: number) {
    super(name, description, model, [ItemType.AMMUNITION, ...type], weight);
    this.caliberType = caliberType;
  }

  select(player: PlayerMp, item: Item) {
    // TODO: maybe attach magazine to hand?
  }

  async use(player: PlayerMp, item: Item) {
    const selectedItemId = player.getVariable<string | null>(PlayerSharedDataType.SelectedItemId);

    if (player.weapon && selectedItemId) {
      const weaponItem = player.character.inventory.find((item: Item) => item && item.id === selectedItemId) as (Item | undefined);

      if (weaponItem && weaponItem.data instanceof WeaponItem) {
        const weaponData = weaponItem.data as WeaponItem;

        if (weaponData.weaponHash === player.weapon && weaponData.caliberType === this.caliberType) {
          console.log('current weapon ammo', player.getWeaponAmmo(player.weapon));
          player.setWeaponAmmo(player.weapon, player.getWeaponAmmo(player.weapon) + 15);
          weaponItem.weaponAmmo = player.getWeaponAmmo(player.weapon);
          console.log('after weapon ammo', player.getWeaponAmmo(player.weapon));
          console.log('weaponItem ammo in clip', weaponItem.weaponAmmo);
          item.quantity --;
        }
      }
    }
  }
}

