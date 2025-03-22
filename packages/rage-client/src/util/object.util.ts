const WEAPON_MODEL_PREFIX = 'w_';


export const getObjectGroundPosition = async (model: string, position: Vector3, heading: number, rotation: Vector3, dimension: number) => {
  if (!mp.game.streaming.isModelValid(mp.game.joaat(model)))
    return;

  const newPos = new mp.Vector3(
    position.x + Math.cos(((heading + 90) * Math.PI) / 180) * 0.6,
    position.y + Math.sin(((heading + 90) * Math.PI) / 180) * 0.6,
    position.z
  );

  const object = mp.objects.new(mp.game.joaat(model), new mp.Vector3(newPos.x, newPos.y, newPos.z),
    { alpha: 255, rotation: rotation, dimension }
  );

  while (object.handle === 0) {
    await mp.game.waitAsync(0);
  }

  object.placeOnGroundProperly();

  if (model.startsWith(WEAPON_MODEL_PREFIX)) {
    object.setRotation(object.rotation.x + 90, object.rotation.y, object.rotation.z, RotationOrder.XYZ, false);
  }

  const groundPosition = [
    object.getCoords(false),
    object.getRotation(2)
  ];

  object.destroy();

  return groundPosition;
};
