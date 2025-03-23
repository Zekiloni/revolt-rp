import { PropertyPointType } from '@revolt-rp/common';
import { getClosestProperty, playerBuyProperty } from '../property/property.service';


export async function playerBuyInteraction(player: PlayerMp) {
  const property = await getClosestProperty(player.position, player.dimension, PropertyPointType.MainPoint);

  if (property)
    await playerBuyProperty(player, property);
}
