
let camera: CameraMp | null = null;

export const takeObjectScreenshot = async (object: ObjectMp, model: string) => {
  const {  minimum, maximum } = mp.game.gameplay.getModelDimensions(object.model);

  const modelSize = {
    x: maximum.x - minimum.x,
    y: maximum.y - minimum.y,
    z: maximum.z - minimum.z
  }

  let fov = Math.min(Math.max(modelSize.x, modelSize.z) / 0.15 * 10, 60);
  const coords = object.getCoords(false);
  const fwd = object.getForwardVector();

  const center = {
    x: coords.x + (minimum.x + maximum.x) / 2,
    y: coords.y + (minimum.y + maximum.y) / 2,
    z: coords.z + (minimum.z + maximum.z) / 2,
  }

  if (fov >= 30) {
    fov = 30;
  }

  const fwdPos = {
    x: center.x + fwd.x * 1.2 + Math.max(modelSize.x, modelSize.z) / 2,
    y: center.y + fwd.y * 1.2 + Math.max(modelSize.x, modelSize.z) / 2,
    z: center.z + fwd.z,
  };

  if (camera && mp.cameras.exists(camera)) {
    camera.setCoord(fwdPos.x, fwdPos.y, fwdPos.z);
    camera.pointAtCoord(center.x, center.y, center.z);
    camera.setFov(fov);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
  } else {
    camera = mp.cameras.new('DEFAULT_SCRIPTED_CAMERA', new mp.Vector3(fwdPos.x, fwdPos.y, fwdPos.z), new mp.Vector3(0, 0, 0), fov);
    camera.pointAtCoord(center.x, center.y, center.z);
    camera.setFov(fov);
    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
  }

  await mp.game.waitAsync(150);

  mp.gui.takeScreenshot(`${model}.png`, 1, 100, 0);
  await mp.game.waitAsync(250);
};
