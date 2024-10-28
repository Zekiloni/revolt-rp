export const getScreenResolution = () => {
  return mp.game.graphics.getScreenActiveResolution(100, 100);
};


export const getCursorWorldPosition = () => {
  const [x, y] = mp.gui.cursor.position;
  if (!x || !y) return;

  return mp.game.graphics.screen2dToWorld3d(new mp.Vector3(x, y, 0));
}
