export const getClothingComponentName = (component: number, drawable: number, texture: number) => {
  const hashNameForComponent = mp.game.files.getHashNameForComponent(mp.players.local.handle, component, drawable, texture);
  return mp.game.gxt.get(hashNameForComponent.toString());
};
