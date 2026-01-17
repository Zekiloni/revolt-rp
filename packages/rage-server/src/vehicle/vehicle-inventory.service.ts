import { ISelectableItem, PlayerSharedDataType, ProcedureKey, VehicleSharedDataType } from '@revolt-rp/common';
import {
  playerGetAvailableItemSlot,
  playerRemoveItemFromInventory
} from '../player/inventory/player-inventory.service';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { WearableItem } from '../item/registry/clothing/wearable-item.model';
import { destroyItem } from '../item/item.service';
import { isSelectableItem, Item } from '@revolt-rp/core';


export const removeAllTrunkItems = async (vehicle: VehicleMp) => {
  vehicle.info.trunk.forEach(destroyItem);
  vehicle.info.trunk = [];
  await vehicle.info.save();
};

export const isVehicleTrunkOpen = (vehicle: VehicleMp) => {
  return vehicle.getVariable<boolean>(VehicleSharedDataType.Trunk) || false;
};


export const getTrunkItemById = (vehicle: VehicleMp, itemId: string) => {
  return vehicle.info.trunk.find((item: Item) => item.id === itemId) as Item | undefined;
};

export const getVehicleTrunk = async (vehicle: VehicleMp) => {
  if (!mp.vehicles.exists(vehicle))
    return;

  if (!vehicle.info.populated('trunk')) {
    await vehicle.info.populate('trunk');
  }

  return vehicle.info.trunk;
};


export const playerTakeTrunkItem = async (player: PlayerMp, vehicle: VehicleMp, item: Item) => {
  vehicle.info.trunk = vehicle.info.trunk.filter((i: Item) => i.id !== item.id);

  if (!vehicle.info.isTemporary)
    await vehicle.info.save();

  const inventorySlot = playerGetAvailableItemSlot(player);

  if (inventorySlot === -1)
    return;

  item.localSlot = inventorySlot;
  await item.save();

  player.character.inventory.push(item);
  await player.character.save();

  triggerBrowsers(player, ProcedureKey.BROWSER_INVENTORY_ADD_ITEM, item);

  return item;
};

export const playerPutTrunkItem = async (player: PlayerMp, vehicle: VehicleMp, item: Item) => {
  if (!item)
    return;

  vehicle.info.trunk.push(item);

  if (!vehicle.info.isTemporary)
    await vehicle.info.save();

  const itemHandler = item.data;

  if (player.getVariable(PlayerSharedDataType.SelectedItemId) === item.id) {
    if (itemHandler && isSelectableItem<PlayerMp, Item>(itemHandler)) {
      (<ISelectableItem<PlayerMp, Item>>itemHandler).deselect(player, item);
    }
  }

  if (item.equipped && itemHandler.isEquipable) {
    const wearableItem = itemHandler as WearableItem;
    item.equipped = false;
    if (wearableItem.unequip)
      (<WearableItem>itemHandler).unequip(player, item);
  }

  item.localSlot = null;
  await item.save();

  await playerRemoveItemFromInventory(player, item.id);

  return item;
};
