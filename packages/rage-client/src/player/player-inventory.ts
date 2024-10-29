import { on, triggerServer } from '@libertymp/rage-rpc';
import { GameUiKey, HexKeyCodes, IItem, ItemSharedDataType, ProcedureKey } from '@bcrp-rage/common';
import { registerKeyBind } from '../core/keybind-manager';
import { getObjectGroundPosition } from '../util/object.util';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { getIsAlive, getIsCuffed, getIsSpawned } from './util/player-data.util';


const INVENTORY_VALIDATORS = [getIsSpawned, getIsCuffed, getIsAlive];
const PICKUP_ITEM_MAX_DISTANCE = 1.25;

let inventoryActive = false;

function toggleInventory() {
  inventoryActive = !inventoryActive;

  if (inventoryActive) {
    showGameInterface(GameUiKey.Inventory);
  } else {
    hideGameInterface(GameUiKey.Inventory);
  }
}

async function dropItemHandler(item: IItem) {
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

function pickupItem() {
  if (!mp.objects.length) return;

  const [closestObject] = mp.objects.getClosest(mp.players.local.position, 1);

  if (!closestObject)
    return;

  const itemId = closestObject.getVariable(ItemSharedDataType.ItemId);

  if (!itemId) {
    return;
  }

  if (mp.players.local.position.subtract(closestObject.position).length() > PICKUP_ITEM_MAX_DISTANCE) {
    return;
  }

  triggerServer(ProcedureKey.SERVER_PLAYER_PICKUP_ITEM, itemId);
}

registerKeyBind(HexKeyCodes.I, true, toggleInventory, 0, INVENTORY_VALIDATORS);
registerKeyBind(HexKeyCodes.Y, true, pickupItem, 0, INVENTORY_VALIDATORS);
on(ProcedureKey.CLIENT_PLAYER_DROP_ITEM, dropItemHandler);
