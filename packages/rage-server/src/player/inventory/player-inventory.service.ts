import { createItem, getItemById } from '../../item/item.service';
import { Types } from 'mongoose';


export const playerGetInventory = (player: PlayerMp) => {
  return player.character.inventory;
}

export const playerGiveItem = async (player: PlayerMp, itemName: string, quantity: number) => {
  const item = await createItem(itemName, quantity);

  await player.character.update(
    { $push: { inventory: item._id } }
  );

  return item;
};

export const isPlayerItemOwner = (player: PlayerMp, itemId: Types.ObjectId) => {
  return player.character.inventory.some(
    (item) => item instanceof Types.ObjectId ? item.equals(itemId) : item?._id.equals(itemId)
  );
};


export const playerDropItem = async (player: PlayerMp, itemId: string, position: Vector3, rotation: Vector3) => {
  const item = await getItemById(itemId);

  if (!item)
    return;

  if (!isPlayerItemOwner(player, item._id))
    return;

  item.dropped = true;
  item.position = position;
  item.rotation = rotation;
  item.dimension = player.dimension;

  item.object = mp.objects.new(mp.joaat(item.data.model), position, {
    rotation, dimension: item.dimension, alpha: 255
  });

  await player.character.update(
    { $pull: { inventory: item._id } }
  );

  await item.save();

  return true;
};


export const playerPickupItem = async (player: PlayerMp, itemId: string) => {
  const item = await getItemById(itemId);

  if (!item)
    return;

  if (!item.dropped)
    return;

  item.dropped = false;
  item.position = null;
  item.rotation = null;
  item.dimension = null;

  const object = item.object;

  if (object && mp.objects.exists(object.id)) {
    object.destroy();
  }

  await player.character.update(
    { $push: { inventory: item._id } }
  );

  await item.save();
};
