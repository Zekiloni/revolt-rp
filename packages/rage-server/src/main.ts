import './core/mongo-db';
import './core/i18next.config';
import './core/server-shutdown';

import './util/colshape.api';

import './item/registry/item.factory';
import './item/item.loader';

import './player/account/account.api';
import './player/character/character.api';
import './player/player-join.api';
import './player/player-quit.api';
import './player/player-chat.api';
import './player/player-data.api';
import './player/player-command.api';
import './player/player-command';
import './player/admin/player-admin-command';
import './player/inventory/player-inventory.api';
import './player/inventory/player-weapon.api';
import './player/inventory/player-handheld-radio.api';
import './player/inventory/phone/player-phone.api';
import './player/offer/player-offer.api';
import './player/payday/player-payday.api';
import './player/damage/player-damage.api';

import './banking/banking.api';
import './banking/banking.command';

import './vehicle/vehicle.api';
import './vehicle/vehicle-command';

import './world/weather.api';

import './organization/organization.api';
import './organization/organization.command';

import './property/property.api';
import './property/property-command';
import { genSaltSync, hashSync } from 'bcryptjs';

// v1.


(async () => {
  const password = hashSync('jasamgej', genSaltSync(12));
  console.log(password);
})();
