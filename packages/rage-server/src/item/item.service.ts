// import { Item, ItemModel } from './item.model';
//
//
// export const createItem = () => {
//   return ItemModel.create();
// };
//
//
// export const destroyItem = async (item: Item) => {
//   const object = item.object;
//   if (object && mp.objects.exists(object)) {
//     object.destroy();
//   }
//   item.delete();
// };
//
//
// export const dropItem = async (item: Item, position: Vector3, rotation: Vector3, dimension: number) => {
//   item.dropped = true;
//   item.rotation = rotation;
//   item.position = position;
//   item.dimension = dimension;
//   item.object = mp.objects.new('ada', position, { rotation, dimension });
//
//   await item.save();
// };
//
