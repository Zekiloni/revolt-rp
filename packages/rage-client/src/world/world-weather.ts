import { WorldDummyEntityType, WorldSharedDateType } from '@revolt-rp/common';


const NATIVES_GRAPHICS_SNOW = '0x6E9EF3A33C8899F8';

function handleWeatherDataChange(entity: EntityMp, value: string, oldValue?: string) {
  if (entity.type !== RageEnums.EntityType.DUMMY)
    return;

  const dummy = entity as unknown as DummyEntityMp;

  if (dummy.dummyType !== WorldDummyEntityType)
    return;

  if (value === 'SNOW') {
    mp.game.invoke(NATIVES_GRAPHICS_SNOW, true);
    mp.gui.chat.push(`Snow enabled`);
  } else {
    mp.game.invoke(NATIVES_GRAPHICS_SNOW, false);
  }
}

mp.events.addDataHandler(WorldSharedDateType.Weather, handleWeatherDataChange);
