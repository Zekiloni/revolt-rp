import { ItemModel } from './item.model';

export const getItemById = (id: string) => {
  return ItemModel.findById(id);
}

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

