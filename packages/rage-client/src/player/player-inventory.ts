import { triggerServer } from '@libertymp/rage-rpc';
import { GameUiKey, HexKeyCodes, IItem, ProcedureKey } from '@bcrp-rage/common';
import { registerKeyBind } from '../core/keybind-manager';
import { getObjectGroundPosition } from '../util/object.util';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { getIsAlive, getIsCuffed, getIsSpawned } from './util/player-data.util';


const INVENTORY_VALIDATORS = [getIsSpawned, getIsCuffed, getIsAlive];

let inventoryActive = false;

function toggleInventory() {
  inventoryActive = !inventoryActive;

  if (inventoryActive) {
    showGameInterface(GameUiKey.Inventory);
  } else {
    hideGameInterface(GameUiKey.Inventory);
  }
}

async function dropItem(item: IItem) {
  if (!item || !item.data.model)
    return;

  const [position, rotation] = await getObjectGroundPosition(
    item.data.model,
    mp.players.local.position,
    mp.players.local.getHeading(),
    mp.players.local.getRotation(2),
    mp.players.local.dimension
  );

  triggerServer(ProcedureKey.SERVER_PLAYER_DROP_ITEM, { itemId: item.id, position, rotation });
}

registerKeyBind(HexKeyCodes.I, true, toggleInventory, 0, INVENTORY_VALIDATORS);
