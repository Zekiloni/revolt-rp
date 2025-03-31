import { GameUiKey, ProcedureKey } from '@revolt-rp/common';
import { showPlayerGameInterface } from '../../player/util/player.util';
import { Property } from '../property.model';
import { triggerBrowsers } from '@libertymp/rage-rpc';


export const openClothingStore = async (player: PlayerMp, property: Property) => {
  showPlayerGameInterface(player, GameUiKey.GroceryStore, () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_PROPERTY, property));
}
