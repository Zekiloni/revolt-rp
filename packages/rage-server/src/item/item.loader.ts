import { getAllDroppedItems, setItemObject } from './item.service';

(async () => {
  const droppedItems = await getAllDroppedItems();
  droppedItems.forEach((item) => {
    const object = mp.objects.new(mp.joaat(item.data.model), item.position, {
      rotation: item.rotation, dimension: item.dimension, alpha: 255
    });

    setItemObject(item, object);
  });
})();
