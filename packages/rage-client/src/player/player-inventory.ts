import { on, register, triggerServer } from '@libertymp/rage-rpc';
import { GameUiKey, HexKeyCodes, IItem, ItemSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { registerKeyBind } from '../core/keybind-manager';
import { getObjectGroundPosition } from '../util/object.util';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { getIsAlive, getIsNotCuffed, getIsSpawned } from './util/player-data.util';
import { distance } from '../util/vector.util';


const SELECT_ITEM_KEYBINDINGS = [
  HexKeyCodes.One,
  HexKeyCodes.Two,
  HexKeyCodes.Three,
  HexKeyCodes.Four,
  HexKeyCodes.Five
];

const INVENTORY_VALIDATORS = [getIsSpawned, getIsNotCuffed, getIsAlive],
  PICKUP_ITEM_MAX_DISTANCE = 1.25,
  P2P_GIVE_ITEM_MAX_DISTANCE = 2.0,
  ITEM_SELECT_COOLDOWN_MS = 1500;

let inventoryActive = false,
  lastSelectTimestamp: null | number = null;

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

  return triggerServer(ProcedureKey.SERVER_PLAYER_DROP_ITEM, { itemId: item.id, position, rotation });
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

function selectItem(slot: number) {
  const now = Date.now();

  if (lastSelectTimestamp && now - lastSelectTimestamp < ITEM_SELECT_COOLDOWN_MS) {
    return;
  }

  triggerServer(ProcedureKey.SERVER_PLAYER_SELECT_ITEM, slot);
  lastSelectTimestamp = now;
}

function isPlayerNearPlayer(target: PlayerMp) {
  return distance(mp.players.local.position, target.position) < P2P_GIVE_ITEM_MAX_DISTANCE && mp.players.local.dimension === target.dimension;
}

function getNearbyPlayersHandler() {
  if (!mp.players.length)
    return [];

  return mp.players.toArray()
    .filter(target => getIsSpawned(target) && isPlayerNearPlayer(target))
    .map(target => ({ value: target.remoteId, label: target.name }));
}

SELECT_ITEM_KEYBINDINGS.forEach((hexKeyCode, index) =>
  registerKeyBind(hexKeyCode, true, () => selectItem(index), 0, INVENTORY_VALIDATORS));
registerKeyBind(HexKeyCodes.I, true, toggleInventory, 0, INVENTORY_VALIDATORS);
registerKeyBind(HexKeyCodes.Y, true, pickupItem, 0, INVENTORY_VALIDATORS);

on(ProcedureKey.CLIENT_PLAYER_DROP_ITEM, dropItemHandler);
register(ProcedureKey.CLIENT_GET_NEARBY_PLAYERS, getNearbyPlayersHandler);
