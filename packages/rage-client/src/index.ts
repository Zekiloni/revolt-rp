import './core/browser';
import './core/default-prevention';
import './core/nametag';
import './core/disabled-control';

import './player/authorization/authorization';
import './player/authorization/character-creator';
import './player/authorization/player-spawn';

import './player/player-animation';
import './player/player-animation-menu';
import './player/player-hud';
import './player/player-death';
import './player/player-damage';
import './player/inventory/player-attachment';
import './player/inventory/player-inventory';
import './player/inventory/player-item';
import './player/inventory/player-weapon';

import './player/other/player-bubble';
import './player/other/player-freeze';
import './player/other/player-offer';

import './vehicle/vehicle-core';
import './vehicle/vehicle.lock';

import './banking/bank-menu';
import './banking/bank-atm';


import './world/world-weather';

// Object.defineProperty(mp.nesto, 'enableSnow', {
//   get: function() {
//     return this._enableSnow;
//   },
//   set: function(toggle) {
//     this._enableSnow = toggle;
//     mp.game.invoke('0x6E9EF3A33C8899F8', toggle);
//   }
// });
