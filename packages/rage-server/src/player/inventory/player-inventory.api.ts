import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@bcrp-rage/common';
import { playerDropItem } from './player-inventory.service';


const playerDropItemHandler = async ({ itemId, position, rotation }: {
  itemId: string,
  position: Vector3,
  rotation: Vector3
}, { player }: ProcedureListenerInfo<PlayerMp>) => {
  await playerDropItem(player, itemId, position, rotation);
};


on(ProcedureKey.SERVER_PLAYER_DROP_ITEM, playerDropItemHandler);
