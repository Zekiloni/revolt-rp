export const getObjectGroundPosition = async (model: string, position: Vector3, heading: number, rotation: Vector3, dimension: number, freeFall = false) => {
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

  if (freeFall) {
    const velocityVector = new mp.Vector3(
      object.getForwardX() * (1 + (1 / 7)),
      object.getForwardY() * (1 + (1 / 7)),
      0.0
    );

    object.setAsMission(true, true);
    object.setActivatePhysicsAsSoonAsItIsUnfrozen(true);
    object.placeOnGroundProperly();
    object.freezePosition(false);
    object.setVelocity(velocityVector.x, velocityVector.y, velocityVector.z);
    object.setDynamic(true);

    mp.gui.chat.push(`Object speed: ${object.getSpeed()}`);
    while (object.getSpeed() > 0.5) {
      await mp.game.waitAsync(0);
    }

    mp.gui.chat.push(`drop item stop`);
  }

  const groundPosition = [
    object.getCoords(false),
    object.getRotation(2)
  ];

  object.destroy();

  return groundPosition;
};
