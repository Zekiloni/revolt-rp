import { getAllDroppedItems, setItemObject } from './item.service';
import { logger } from '@revolt-rp/core';

const itemLoaderLogger = logger('item-loader');

(async () => {
  const droppedItems = await getAllDroppedItems();
  droppedItems.forEach((item) => {
    try {
      const object = mp.objects.new(mp.joaat(item.data.model), item.position, {
        rotation: item.rotation, dimension: item.dimension, alpha: 255
      });

      setItemObject(item, object);
    } catch (e) {
      itemLoaderLogger.error(`Failed to load dropped item object for item ID ${item.id}: ${e.message}`);
      return;
    }
  });
})();
