import { CaliberType, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { Item } from '../../item/item.model';
import { WeaponItem } from '../../item/registry/weapon-item.model';
import { playerRemoveItemFromInventory } from './player-inventory.service';
import { triggerBrowsers } from '@libertymp/rage-rpc';


export const getPlayerAmmoItemByCaliber = (player: PlayerMp, caliber: CaliberType) => {
  return player.character.inventory.find((item: Item) => item.data.isAmmo && (item.data as WeaponItem).caliberType === caliber) as Item | undefined;
};

export const playerReloadWeapon = async (player: PlayerMp, weapon: number) => {
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

  if (!ammoItem)
    return;

  const ammoItemHandler = ammoItem.data;

  ammoItemHandler.use(player, ammoItem);

  await weaponItem.save();

  if (ammoItem.quantity === 0) {
    await playerRemoveItemFromInventory(player, ammoItem.id);
    await ammoItem.delete();
  } else {
    await ammoItem.save();
    triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_UPDATE_ITEM, ammoItem);
  }
};
