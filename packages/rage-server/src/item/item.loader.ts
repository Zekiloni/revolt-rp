import { getAllDroppedItems } from './item.service';

(async () => {
  const droppedItems = await getAllDroppedItems();

  droppedItems.forEach((item) => {
    item.object = mp.objects.new(mp.joaat(item.data.model), item.position, {
      rotation: item.rotation, dimension: item.dimension, alpha: 255
    });
  });
})();
