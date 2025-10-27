import { triggerBrowsers } from '@libertymp/rage-rpc';
import { GameUiKey, ProcedureKey } from '@revolt-rp/common';
import { Property } from '@revolt-rp/core';
import { showPlayerGameInterface } from '../../player/util/player.util';


export const isOrganizationGarage = (property: Property) => {
  return property.parentProperty && (<Property>property.parentProperty).owner.type === 'Organization';
};


// TODO [RAGE-164]: Check if parent property is owned by organization && is the player in same organization
//  if so, open organization vehicle spawner menu if property.vehicles.length
//  else should be player owned garage of some house etc. > enter garage interior
export const toggleGarageMenu = (player: PlayerMp, property: Property) => {
  if (isOrganizationGarage(property)) {
    console.log('debug: toggleGarageMenu - organization garage', property);
    showPlayerGameInterface(player, GameUiKey.GarageMenu, () => {
      triggerBrowsers(player, ProcedureKey.BROWSER_SET_GARAGE, property);
    });
  } else {
    // TODO [RAGE-164]: Open player owned garage menu
    player.call('garage:toggleMenu', [property.id]);
  }
};
