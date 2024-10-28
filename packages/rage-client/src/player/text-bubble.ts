import { PlayerSharedDataType } from '@bcrp-rage/common';


function playerTextBubbleHandler(entity: EntityMp, value: string | null, oldValue?: string | null) {
  if (entity && entity.type != RageEnums.EntityType.PLAYER) return;


}

mp.events.addDataHandler(PlayerSharedDataType.TextBubble, playerTextBubbleHandler);
