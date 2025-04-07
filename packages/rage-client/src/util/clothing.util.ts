export const getClothingComponentName = (component: number, drawable: number, texture: number) => {
  const hashNameForComponentWrapper = mp.game.files.getHashNameForComponent(mp.players.local.handle, component, drawable, texture);
  const nativeValue = mp.game.invoke(RageEnums.Natives.FILES.GET_HASH_NAME_FOR_COMPONENT, component, drawable, texture);
  const nativeValueN = mp.game.invoke(RageEnums.Natives.FILES.GET_HASH_NAME_FOR_COMPONENT + 'n', component, drawable, texture);

  mp.console.logInfo(`getClothingComponentName: ${component} ${drawable} ${texture}, nativeValue: ${nativeValue}, nativeValueN ${nativeValueN}`);
  mp.console.logInfo(`getClothingComponentName: ${component} ${drawable} ${texture}, hashNameForComponent: ${hashNameForComponentWrapper}`);


  //  mp.game.ui.getLabelText
  return mp.game.gxt.getDefault(hashNameForComponentWrapper.toString());
};
