import { WorldDummyEntityType, WorldSharedDateType } from '@revolt-rp/common';


const NATIVES_GRAPHICS_SNOW = '0x6E9EF3A33C8899F8';


function handleWeatherDataChange(entity: EntityMp, value: boolean, oldValue?: boolean) {
  if (entity.type !== RageEnums.EntityType.DUMMY)
    return;

  const dummy = entity as unknown as DummyEntityMp;

  if (dummy.dummyType !== WorldDummyEntityType)
    return;

  mp.game.invoke(NATIVES_GRAPHICS_SNOW, value);
}

mp.events.addDataHandler(WorldSharedDateType.EnableSnow, handleWeatherDataChange);
