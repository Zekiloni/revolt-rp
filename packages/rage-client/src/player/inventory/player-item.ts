import { PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { triggerServer } from '@libertymp/rage-rpc';

let leftMouseClicked = false;

export const toggleClickToUseItem = (toggle: boolean) => {
  if (toggle) {
    mp.events.add('click', handleMouseClick);
  } else {
    mp.events.remove('click', handleMouseClick);
  }
};

function handleMouseClick(
  absoluteX: number,
  absoluteY: number,
  upOrDown: 'up' | 'down',
  leftOrRight: 'left' | 'right',
  relativeX: number,
  relativeY: number,
  worldPosition: Vector3,
  hitEntity: number
) {
  if (leftOrRight === 'left') {
    if (leftMouseClicked) {
      return;
    }

    leftMouseClicked = true;
    triggerServer(ProcedureKey.SERVER_PLAYER_USE_ITEM);

    setTimeout(() => {
      leftMouseClicked = false;
    }, 500);
  }
}

function playerClickToUseItemDataHandler(player: PlayerMp, value: boolean, oldValue?: boolean) {
  if (player.type != RageEnums.EntityType.PLAYER) return;

  if (mp.players.local.handle === player.handle) {
    toggleClickToUseItem(value);
  }
}

mp.events.addDataHandler(PlayerSharedDataType.ClickToUse, playerClickToUseItemDataHandler);
