import { GameUiKey, ItemSharedDataType } from '@revolt-rp/common';
import { distanceTo } from '../../util/vector.util';
import { hideGameInterface, showGameInterface } from '../../core/browser';


interface BoomboxInstance {
  object: ObjectMp;
  browser: BrowserMp;
}

const boomboxes: BoomboxInstance[] = [];


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
  const browser = showGameInterface(GameUiKey.Speaker);
  boomboxes.push({ object, browser: browser });
};

const stopBoombox = (object: ObjectMp) => {
  const index = boomboxes.findIndex(b => b.object === object);
  if (index === -1) return;

  const boombox = boomboxes[index];
  if (mp.browsers.exists(boombox.browser)) {
    boombox.browser.destroy();
  }

  boomboxes.splice(index, 1);
};

const boomboxHandler = setInterval(() => {
  const boombox = getClosestBoombox();
  if (boombox) {
    if (distanceTo(boombox.position, mp.players.local.position) < 3 && mp.players.local.hasClearLosTo(boombox.handle, 17)) {
      startBoombox(boombox);
    } else {
      stopBoombox(boombox);
    }
  } else {
    boomboxes.forEach(b => stopBoombox(b.object));
  }
}, 1000);

mp.events.add('render', () => {
  boomboxes.forEach(b => {
    const pos = new mp.Vector3(b.object.position.x, b.object.position.y, b.object.position.z + 1.0); // 1.0 above

    const screen = mp.game.graphics.world3dToScreen2d(pos);
    if (!screen) return;

    const dict = b.browser.headlessTextureDict;
    const name = b.browser.headlessTextureName;
    const height = b.browser.headlessTextureHeightScale;

    // Draw small floating UI box
    mp.game.graphics.drawSprite(dict, name, screen.x, screen.y, 0.15, height * 0.15, 0, 255, 255, 255, 255, false);
  });
});
