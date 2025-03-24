export const setCheckpointDirection = (checkpoint: CheckpointMp, direction: Vector3) => {
  mp.game.invoke(RageEnums.Natives.GRAPHICS.SET_CHECKPOINT_DIRECTION, checkpoint.handle, direction.x, direction.y, direction.z);
};
