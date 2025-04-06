export const getClothingComponentName = (component: number, drawable: number, texture: number) => {
  const drawableVariation = mp.players.local.getDrawableVariation(component);
  const textureVariation = mp.players.local.getTextureVariation(component);
  const hashNameForComponentWrapper = mp.game.files.getHashNameForComponent(mp.players.local.handle, component, drawableVariation, textureVariation);
  const nativeValue = mp.game.invoke(RageEnums.Natives.FILES.GET_HASH_NAME_FOR_COMPONENT, component, drawableVariation, textureVariation);
  mp.console.logInfo(`getClothingComponentName: ${component} drawable: ${drawable}, drawableVariation ${drawableVariation}`);
  mp.console.logInfo(`getClothingComponentName: ${component} ${drawable} ${texture}, nativeValue: ${nativeValue}`);
  mp.console.logInfo(`getClothingComponentName: ${component} ${drawable} ${texture}, hashNameForComponent: ${hashNameForComponentWrapper}`);


  //  mp.game.ui.getLabelText
  return mp.game.gxt.getDefault(hashNameForComponentWrapper.toString());
};
