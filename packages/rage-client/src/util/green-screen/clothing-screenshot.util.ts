import { greenScreenConfig } from './green-screen.config';

let cameraInfo: any | null = null;
let camera: CameraMp | null = null;


export async function takeClothingComponentScreenshot(
  pedType: 'mp_f_freemode_01' | 'mp_m_freemode_01', type: 'CLOTHING' | 'PROP', component: number,
  drawable: number, texture: number, cameraSettings?: any
) {
  const camInfo = cameraSettings ? cameraSettings : greenScreenConfig.cameraSettings[type][component];

  if (!cameraInfo || camInfo.zPos !== cameraInfo.zPos || camInfo.fov !== cameraInfo.fov) {
    cameraInfo = camInfo;
  }

  mp.players.local.setRotation(greenScreenConfig.greenScreenRotation.x, greenScreenConfig.greenScreenRotation.y, greenScreenConfig.greenScreenRotation.z, 0, false);
  mp.players.local.setCoordsNoOffset(greenScreenConfig.greenScreenPosition.x, greenScreenConfig.greenScreenPosition.y, greenScreenConfig.greenScreenPosition.z, false, false, false);

  await mp.game.waitAsync(50);

  const { x: playerX, y: playerY, z: playerZ } = mp.players.local.getCoords(true);
  const { x: fwdX, y: fwdY, z: fwdZ } = mp.players.local.getForwardVector();

  const fwdPos = {
    x: playerX + fwdX * 1.2,
    y: playerY + fwdY * 1.2,
    z: playerZ + fwdZ + camInfo.zPos
  };

  if (!camera || mp.cameras.exists(camera)) {
    camera = mp.cameras.new('DEFAULT_SCRIPTED_CAMERA', new mp.Vector3(fwdPos.x, fwdPos.y, fwdPos.z), new mp.Vector3(0, 0, 0), camInfo.fov);
    camera.pointAtCoord(playerX, playerY, playerZ + camInfo.zPos);
    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
  }

  await mp.game.waitAsync(50);

  mp.players.local.setRotation(camInfo.rotation.x, camInfo.rotation.y, camInfo.rotation.z, 2, false);

  const palette = 0;
  const name = `${pedType}_${type.toLowerCase()}_${component}_${drawable}_${texture}_${palette}.png`;

  mp.gui.takeScreenshot(name, 1, 100, 0);
  await mp.game.waitAsync(350);
}


export async function loadComponentVariation(component: number, drawable: number, texture: number) {
  // mp.game.ped.setPreloadVariationData(mp.game.player.getPed(), component, drawable, texture)
  //
  // while (mp.game.ped.hasPreloadVariationDataFinished(mp.game.player.getPed())) {
  //   await mp.game.waitAsync(50);
  // }

  mp.players.local.setComponentVariation(component, drawable, texture, 0);
  await mp.game.waitAsync(50);
}

export async function resetPedComponents() {
  mp.game.invoke(RageEnums.Natives.PED.SET_PED_DEFAULT_COMPONENT_VARIATION, mp.players.local.handle);

  await mp.game.waitAsync(50);

  mp.players.local.setComponentVariation(0, 0, 1, 0); // Head
  mp.players.local.setComponentVariation(1, 0, 0, 0); // Mask
  mp.players.local.setComponentVariation(2, -1, 0, 0); // Hair
  mp.players.local.setComponentVariation(7, 0, 0, 0); // Accessories
  mp.players.local.setComponentVariation(5, 0, 0, 0); // Bags
  mp.players.local.setComponentVariation(6, -1, 0, 0); // Shoes
  mp.players.local.setComponentVariation(9, 0, 0, 0); // Armor
  mp.players.local.setComponentVariation(3, -1, 0, 0); // Torso
  mp.players.local.setComponentVariation(8, -1, 0, 0); // Undershirt
  mp.players.local.setComponentVariation(4, -1, 0, 0); // Legs
  mp.players.local.setComponentVariation(11, -1, 0, 0); // Top

  mp.players.local.setHairColor(45, 15);

  mp.players.local.clearAllProps();
}
