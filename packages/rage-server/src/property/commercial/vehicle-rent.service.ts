import { triggerBrowsers } from '@libertymp/rage-rpc';
import { GameUiKey, ProcedureKey } from '@revolt-rp/common';
import { showPlayerGameInterface } from '../../player/util/player.util';
import { Property } from '../property.model';


export function openRentMenu(player: PlayerMp, property: Property) {
  showPlayerGameInterface(player, GameUiKey.RentCatalog,
    () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_PROPERTY, property));
}
