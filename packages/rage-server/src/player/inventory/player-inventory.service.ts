import { getItemById } from '../../item/item.service';


export const playerDropItem = async (player: PlayerMp, itemId: string, position: Vector3, rotation: Vector3) => {
  const item = await getItemById(itemId);

  if (!item)
    return;

  item.dropped = true;
  await item.save();
};
