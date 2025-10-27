import { getAllDroppedItems, setItemObject } from './item.service';
import { ItemModel } from '@revolt-rp/core';
import { getBaseItem, isValidItem } from './registry/item-registry.util';

ItemModel.schema.virtual('data').get(function() {
  return isValidItem(this.name) ? getBaseItem(this.name) : null;
});

(async () => {
  const droppedItems = await getAllDroppedItems();

  droppedItems.forEach((item) => {
    const object = mp.objects.new(mp.joaat(item.data.model), item.position, {
      rotation: item.rotation, dimension: item.dimension, alpha: 255
    });
    setItemObject(item, object);
  });
})();
