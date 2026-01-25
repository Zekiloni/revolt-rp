import { showGameInterface } from '../../core/browser';
import { GameUiKey, ItemSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { triggerBrowser } from '@libertymp/rage-rpc';

const tvs: { render: number, browser: BrowserMp, remoteId: number, texture: string }[] = [];

function televisionObjectEntityStreamIn(entity: EntityMp) {
  if (entity.type !== RageEnums.EntityType.OBJECT)
    return;

  try {
    const television = entity.getVariable(ItemSharedDataType.TV) as {
      source: string
      volume: number
    };

    if (television) {
      startTv(entity.model, television, entity.remoteId);
    }
  } catch (ex) {
    mp.console.logError(ex);
  }
}
mp.events.add({
  entityStreamIn: televisionObjectEntityStreamIn
})

mp.events.add('entityStreamOut', (entity) => {
  if (entity.type !== RageEnums.EntityType.OBJECT)
    return;

  const tvJson = entity.getVariable('TV') as string;
  if (tvJson)
    stopTv(entity.remoteId);
});

const createRenderTarget = (name: string, model: number) => {
  if (!mp.game.ui.isNamedRendertargetRegistered(name))
    mp.game.ui.registerNamedRendertarget(name, false);

  if (!mp.game.ui.isNamedRendertargetLinked(model))
    mp.game.ui.linkNamedRendertarget(model);

  return mp.game.ui.getNamedRendertargetRenderId(name);
}

const startTv = (model: number, tv: any, remoteId: number) => {
  const browser = showGameInterface(GameUiKey.TV);
  setTimeout(() => {
    triggerBrowser(browser, ProcedureKey.BROWSER_TV_INIT, tv);
  })

  const render = createRenderTarget(tv.texture, model);

  tvs.push({ render, browser, remoteId, texture: tv.texture });
};

mp.events.add('render', () => {
  tvs.forEach((tv) => {
    mp.game.ui.setTextRenderId(tv.render);
    const dict = tv.browser.headlessTextureDict;
    const texture = tv.browser.headlessTextureName;
    const heightScale = tv.browser.headlessTextureHeightScale;
    mp.game.graphics.drawSprite(dict, texture, 0.5, 0.5, 1, heightScale, 0, 255, 255, 255, 255, false);
    mp.game.ui.setTextRenderId(1);
  });
});

const stopTv = (remoteId: number) => {
  const tv = tvs.find(x => x.remoteId == remoteId);
  if (!tv)
    return;

  if (mp.game.ui.isNamedRendertargetRegistered(tv.texture))
    mp.game.ui.releaseNamedRendertarget(tv.texture);

  tv.browser.destroy();
  tvs.splice(tvs.indexOf(tv), 1);
}

mp.events.addDataHandler('DoorLocked', (entity, value, oldValue) => {
  if (entity.type != RageEnums.EntityType.OBJECT)
    return;

  mp.game.object.setStateOfClosestDoorOfType(entity.model, entity.position.x, entity.position.y, entity.position.z, value, 0.0, false);
});

mp.events.addDataHandler('TV', (entity, value, oldValue) => {
  if (entity.type != RageEnums.EntityType.OBJECT)
    return;

  if (value) {
    const tv = JSON.parse(value);
    const tvHandle = tvs.find(x => x.remoteId == entity.remoteId);
    if (!tvHandle) {
      startTv(entity.model, tv, entity.remoteId);
      return;
    }

    const oldTv = JSON.parse(oldValue);
    // if (tv.source != oldTv?.source)
    //   tvHandle.browser.call(Constants.TV_PAGE_TURN_ON, tv.source);
    // else
    //   tvHandle.browser.call(Constants.TV_PAGE_SET_VOLUME, tv.volume);
  } else {
    stopTv(entity.remoteId);
  }
});

