import { on, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { GameUiKey, HexKeyCodes, IItem, ItemSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { registerKeyBind } from '../../core/keybind-manager';
import { getObjectGroundPosition } from '../../util/object.util';
import {
  browser,
  hideGameInterface,
  isMouseActive,
  isGameInterfaceActive,
  showGameInterface
} from '../../core/browser';
import { getIsAlive, getIsNotCuffed, getIsSpawned } from '../util/player-data.util';
import { isNearAnyOpenedTrunk } from '../../vehicle/vehicle-core';


const SELECT_ITEM_KEYBINDINGS = [
  HexKeyCodes.One,
  HexKeyCodes.Two,
  HexKeyCodes.Three,
  HexKeyCodes.Four,
  HexKeyCodes.Five
];

export const INVENTORY_VALIDATORS = [getIsSpawned, getIsNotCuffed, getIsAlive],
  PICKUP_ITEM_MAX_DISTANCE = 1.45,
  ITEM_SELECT_COOLDOWN_MS = 1500;

let lastSelectTimestamp: null | number = null;

function toggleInventory() {
  if (isGameInterfaceActive(GameUiKey.Trunk)) {
    hideGameInterface(GameUiKey.Trunk);
    return;
  }

  const vehicle = isNearAnyOpenedTrunk();

  if (vehicle) {
    if (isGameInterfaceActive(GameUiKey.Inventory))
      return hideGameInterface(GameUiKey.Inventory);

    showGameInterface(GameUiKey.Trunk);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_VEHICLE, vehicle.remoteId), 150);
    return;
  }

  isGameInterfaceActive(GameUiKey.Inventory)
    ? hideGameInterface(GameUiKey.Inventory)
    : showGameInterface(GameUiKey.Inventory);
}

async function dropItemHandler({ playerRemoteId, item }: { playerRemoteId: number, item: IItem }) {
  if (!item || !item.data.model)
    return;

  const player = mp.players.atRemoteId(playerRemoteId);

  if (!player)
    return;

  const [position, rotation] = await getObjectGroundPosition(
    item.data.model,
    player.position,
    player.getHeading(),
    player.getRotation(2),
    player.dimension,
    true
  );

  const alreadySyncedItem = mp.objects.getClosest(position, 5)
    .find(object => object.getVariable(ItemSharedDataType.ItemId) === item.id);

  if (alreadySyncedItem)
    return;

  triggerServer(ProcedureKey.SERVER_DROPPED_ITEM_SYNC, { itemId: item.id, position, rotation });
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

  mp.gui.chat.push(`Selecting item in slot ${slot + 1}`);
  if (lastSelectTimestamp && now - lastSelectTimestamp < ITEM_SELECT_COOLDOWN_MS) {
    return;
  }

  mp.gui.chat.push('Triggering server to select item');
  triggerServer(ProcedureKey.SERVER_PLAYER_SELECT_ITEM, slot);
  lastSelectTimestamp = now;
}


SELECT_ITEM_KEYBINDINGS.forEach((hexKeyCode, index) =>
  registerKeyBind(hexKeyCode, true, () => selectItem(index), 0, [
    ...INVENTORY_VALIDATORS, () => isMouseActive() === false
  ]));

registerKeyBind(HexKeyCodes.I, true, toggleInventory, 0, INVENTORY_VALIDATORS);
registerKeyBind(HexKeyCodes.Y, true, pickupItem, 0, INVENTORY_VALIDATORS);

on(ProcedureKey.CLIENT_PLAYER_DROP_ITEM, dropItemHandler);
