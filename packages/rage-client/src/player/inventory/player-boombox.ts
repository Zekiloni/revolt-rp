import { GameUiKey, ItemSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { distanceTo } from '../../util/vector.util';
import {  showGameInterface } from '../../core/browser';
import { triggerBrowser } from '@libertymp/rage-rpc';
import { getSoundId } from '../../audio/audio';


interface BoomboxInstance {
  object: ObjectMp;
  browser: BrowserMp;
}

const speakerInstances: BoomboxInstance[] = [];


const isSpeaker = (object: ObjectMp) => {
  const itemName = object.getVariable<string | undefined>(ItemSharedDataType.ItemName);
  return object.getVariable(ItemSharedDataType.ItemId) && itemName && itemName.toLowerCase().includes('speaker');
};

export const getClosestBoombox = (): ObjectMp | null => {
  if (!mp.objects.length)
    return;

  const [closestObject] = mp.objects.getClosest(mp.players.local.position, 1);

  return closestObject && isSpeaker(closestObject) ? closestObject : null;
};

const startBoombox = (object: ObjectMp) => {
  if (speakerInstances.find(b => b.object.handle === object.handle)) return;
  const browser = showGameInterface(GameUiKey.Speaker);
  speakerInstances.push({ object, browser: browser });
  const soundId = getSoundId(object);

  setTimeout(() => {
    if (!mp.browsers.exists(browser)) return;
    triggerBrowser(browser, ProcedureKey.BROWSER_SET_SPEAKER_AUDIO, soundId);
  }, 250);
};

const stopBoombox = (object: ObjectMp) => {
  const index = speakerInstances.findIndex(b => b.object === object);
  if (index === -1) return;

  const boombox = speakerInstances[index];
  if (mp.browsers.exists(boombox.browser)) {
    boombox.browser.destroy();
  }

  speakerInstances.splice(index, 1);
};

const boomboxHandler = setInterval(() => {
  const boombox = getClosestBoombox();
  if (boombox) {
    if (distanceTo(boombox.position, mp.players.local.position) < 3 && mp.players.local.hasClearLosTo(boombox.handle, 17)) {
      startBoombox(boombox);
      mp.gui.chat.push('Boombox in range');
    } else {
      mp.gui.chat.push('Boombox out of range');
      stopBoombox(boombox);
    }
  } else {
    speakerInstances.forEach(b => stopBoombox(b.object));
  }
}, 1000);

mp.events.add('render', () => {
  speakerInstances.forEach(speaker => {
    const pos = new mp.Vector3(speaker.object.position.x, speaker.object.position.y, speaker.object.position.z + 1.0);

    if (speaker.browser && mp.browsers.exists(speaker.browser)) {
      const screen = mp.game.graphics.world3dToScreen2d(pos);
      if (!screen) return;

      const dict = speaker.browser.headlessTextureDict;
      const name = speaker.browser.headlessTextureName;
      const height = speaker.browser.headlessTextureHeightScale;

      mp.game.graphics.drawSprite(dict, name, screen.x, screen.y, 0.3, height * 0.3, 0, 255, 255, 255, 255, false);
    }
  });
});
