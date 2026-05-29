type ClickHandler = (
  absoluteX: number,
  absoluteY: number,
  upOrDown: 'up' | 'down',
  leftOrRight: 'left' | 'right',
  relativeX: number,
  relativeY: number,
  worldPosition: Vector3,
  hitEntity: number
) => void;

type ClickHandlerFn = (args: {
  absoluteX: number;
  absoluteY: number;
  relativeX: number;
  relativeY: number;
  worldPosition: Vector3;
  hitEntity: number;
}) => void;


export function onMouseClick(
  leftOrRight: 'left' | 'right',
  upOrDown: 'up' | 'down',
  handler: ClickHandlerFn,
  once = false
) {
  const wrapper: ClickHandler = (
    absoluteX,
    absoluteY,
    clickUpOrDown,
    clickLeftOrRight,
    relativeX,
    relativeY,
    worldPosition,
    hitEntity
  ) => {
    if (clickLeftOrRight === leftOrRight && clickUpOrDown === upOrDown) {
      handler({ absoluteX, absoluteY, relativeX, relativeY, worldPosition, hitEntity });
      if (once) mp.events.remove('click', wrapper);
    }
  };

  mp.events.add('click', wrapper);
  return () => mp.events.remove('click', wrapper);
}
