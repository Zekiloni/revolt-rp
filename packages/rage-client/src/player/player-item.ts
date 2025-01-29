import { PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { triggerServer } from '@libertymp/rage-rpc';


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
  if (leftOrRight === 'left')
    triggerServer(ProcedureKey.SERVER_PLAYER_USE_ITEM);
}

function playerClickToUseItemDataHandler(player: PlayerMp, value: boolean, oldValue?: boolean) {
  if (player.type != RageEnums.EntityType.PLAYER) return;

  if (mp.players.local.id === player.id) {
    if (value) {
      mp.events.add('click', handleMouseClick);
    } else {
      mp.events.remove('click', handleMouseClick);
    }
  }
}

mp.events.addDataHandler(PlayerSharedDataType.ClickToUse, playerClickToUseItemDataHandler);
