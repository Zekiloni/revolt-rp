export const getScreenResolution = () => {
  return mp.game.graphics.getScreenActiveResolution(0, 0);
};


export const getCursorWorldPosition = () => {
  const [x, y] = mp.gui.cursor.position;
  if (!x || !y) return;

  return mp.game.graphics.screen2dToWorld3d(new mp.Vector3(x, y, 0));
}


export function getMinimapAnchor() {
  const sfX = 1.0 / 20.0;
  const sfY = 1.0 / 20.0;
  const safeZone = mp.game.graphics.getSafeZoneSize();
  const aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
  const resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
  const scaleX = 1.0 / resolution.x;
  const scaleY = 1.0 / resolution.y;

  const width = scaleX * (resolution.x / (4 * aspectRatio));
  const height = scaleY * (resolution.y / 5.674);
  const leftX = scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10)));
  const bottomY = 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10)));

  return {
    width,
    height,
    scaleX,
    scaleY,
    leftX,
    rightX: leftX + width,
    bottomY,
    topY: bottomY - height
  };
}

export function getMinimapLeft(): number {
  const minimap = this.getMinimapAnchor();
  const window = getScreenResolution()
  return minimap.leftX * window.x;
}

export function getMinimapRight(): number {
  const minimap = this.getMinimapAnchor();
  const window = getScreenResolution()
  return minimap.rightX * window.x;
}

export function getMinimapWidth(): number {
  const minimap = this.getMinimapAnchor();
  const window = getScreenResolution()
  return minimap.width * window.x;
}
