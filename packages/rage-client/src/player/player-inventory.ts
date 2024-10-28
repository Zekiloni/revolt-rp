import { HexKeyCodes } from '@bcrp-rage/common';
import { registerKeyBind } from '../core/keybind-manager';

let inventoryActive = false;

function toggleInventory() {
  inventoryActive = !inventoryActive;
}

registerKeyBind(HexKeyCodes.I, true, toggleInventory);
