import { CaliberType, PlayerSharedDataType } from '@revolt-rp/common';
import { Item } from '../../item/item.model';
import { WeaponItem } from '../../item/registry/weapon-item.model';


export const getPlayerAmmoItemByCaliber = (player: PlayerMp, caliber: CaliberType) => {
  return player.character.inventory.find((item: Item) => item.data.isAmmo && (item.data as WeaponItem).caliberType === caliber) as Item | undefined;
};

export const playerReloadWeapon = (player: PlayerMp, weapon: number) => {
  const selectedItemId = player.getVariable<string | null>(PlayerSharedDataType.SelectedItemId);

  if (!selectedItemId)
    return;

  const weaponItem = player.character.inventory.find((item: Item) => item.id === selectedItemId) as Item | undefined;

  if (!weaponItem)
    return;

  const weaponData = weaponItem.data as WeaponItem;

  if (weaponData.weaponHash !== weapon)
    return;

  const ammoItem = getPlayerAmmoItemByCaliber(player, weaponData.caliberType);
  const ammoItemHandler = ammoItem.data;

  ammoItemHandler.use(player, ammoItem);
};
