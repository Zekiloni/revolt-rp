export async function startParticleFxLoopedAtCoord(fxName: string, effectName: string, position: Vector3, rotation: Vector3, scale: number, xAxis: boolean, yAxis: boolean, zAxis: boolean) {
  if (!mp.game.streaming.hasNamedPtfxAssetLoaded(fxName)) {
    mp.game.streaming.requestNamedPtfxAsset(fxName);
    while (!mp.game.streaming.hasNamedPtfxAssetLoaded(fxName)) {
      await mp.game.waitAsync(0);
    }
  }

  mp.game.graphics.setPtfxAssetNextCall(fxName);

  return mp.game.graphics.startParticleFxLoopedAtCoord(effectName, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, scale, xAxis, yAxis, zAxis, false);
}
