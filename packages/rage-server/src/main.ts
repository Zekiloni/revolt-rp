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
import './player/player-main.api';
import './player/player-command.api';
import './player/player-command';
import './player/admin/player-admin-command';
import './player/inventory/player-inventory.api';
import './player/inventory/player-weapon.api';
import './player/inventory/player-handheld-radio.api';
import './player/inventory/phone/player-phone.api';
import './player/inventory/phone/player-phone.command';
import './player/offer/player-offer.api';
import './player/payday/player-payday.api';
import './player/damage/player-damage.api';

import './banking/banking.api';

import './vehicle/vehicle.api';
import './vehicle/vehicle-menu.api';
import './vehicle/vehicle-inventory.api';
import './vehicle/vehicle-command';

import './world/weather.api';

import './organization/organization.api';
import './organization/organization.command';

import './property/property.api';
import './property/property-command';
import './property/catalog/property-catalog.api';

import './property/commercial/grocery-store.api';
import './property/commercial/clothing-store.api';
import './property/commercial/vehicle-rent.api';
import './property/commercial/vehicle-dealership.api';

import './property/public-service/dmv.api';

import './internet/advertisement/advertisement.api';

import './job/base-job.api';
import './job/sanitation-job.api';
