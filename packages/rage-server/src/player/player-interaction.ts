import { PropertyPointType } from '@revolt-rp/common';
import { getClosestProperty, playerBuyProperty } from '../property/property.service';

export const P2P_MAX_DISTANCE = 2.0;


export async function playerBuyInteraction(player: PlayerMp) {
  const property = await getClosestProperty(player.position, player.dimension, PropertyPointType.MainPoint);

  if (property)
    await playerBuyProperty(player, property);
}
