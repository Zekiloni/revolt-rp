import { PropertyPointType } from '@revolt-rp/common';
import { getClosesProperty, playerBuyProperty } from '../property/property.service';


export async function playerBuyInteraction(player: PlayerMp) {
  const property = await getClosesProperty(player.position, player.dimension, PropertyPointType.Main);

  if (property)
    await playerBuyProperty(player, property);
}
