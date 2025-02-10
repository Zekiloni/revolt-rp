import { WorldDummyEntityType, WorldSharedDateType } from '@revolt-rp/common';


const NATIVES_GRAPHICS_SNOW = '0x6E9EF3A33C8899F8';

function handleWeatherDataChange(entity: EntityMp, value: RageEnums.Weather, oldValue?: RageEnums.Weather) {
  if (entity.type !== RageEnums.EntityType.DUMMY)
    return;

  mp.gui.chat.push(`Weather changed to ${value}`);
  const dummy = entity as unknown as DummyEntityMp;

  if (dummy.dummyType !== WorldDummyEntityType)
    return;
  mp.gui.chat.push(`Weather changed to ${value}`);

  if (value === RageEnums.Weather.SNOW) {
    mp.game.invoke(NATIVES_GRAPHICS_SNOW, true);
    mp.gui.chat.push(`Snow enabled`);
  } else {
    mp.game.invoke(NATIVES_GRAPHICS_SNOW, false);
  }
}

mp.events.addDataHandler(WorldSharedDateType.Weather, handleWeatherDataChange);
