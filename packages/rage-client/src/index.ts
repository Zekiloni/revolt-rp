import './core/i18n-config';
import './core/browser';
import './core/default-prevention';
import './core/nametag';
import './core/disabled-control';
import './core/afk';

import './player/authorization/authorization';
import './player/authorization/character-creator';
import './player/authorization/player-spawn';

import './player/player-menu';
import './player/player-animation';
import './player/player-animation-menu';
import './player/p2p-interaction';
import './player/player-hud';
import './player/player-death';
import './player/player-damage';
import './player/inventory/player-attachment';
import './player/inventory/player-inventory';
import './player/inventory/player-item';
import './player/inventory/player-weapon';
import './player/inventory/player-phone';
import './player/player-drugs';

import './player/other/player-bubble';
import './player/other/player-freeze';
import './player/other/player-offer';
import './player/other/player-highlight-target';
import './player/other/player-cuffed';

import './vehicle/vehicle-core';
import './vehicle/vehicle.lock';
import './vehicle/driving-test';
import './vehicle/seatbelt';

import './vehicle/organization/law/plate-recognition';
import './vehicle/organization/law/heli-cam';

import './banking/bank-atm';

import './world/world-weather';

import './player/admin/no-clip';
import './player/admin/spectate';

import './organization/organization-menu';

import './property/property-core';
import './property/clothing-store';
import './property/vehicle-dealership';

import './job/garbage-collecting';
import './job/fishing';

import './screenshoter';

// Object.defineProperty(mp.nesto, 'enableSnow', {
//   get: function() {
//     return this._enableSnow;
//   },
//   set: function(toggle) {
//     this._enableSnow = toggle;
//     mp.game.invoke('0x6E9EF3A33C8899F8', toggle);
//   }
// });
