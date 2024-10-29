import { AdminType } from '@bcrp-rage/common';
import './core/mongo-db';
import './core/i18next.config';
import './player/account/account.api';
import './player/character/character.api';
import './player/player-join.api';
import './player/player-quit.api';
import './player/player-chat.api';
import './player/player-command.api';
import './player/player-command';
import './player/admin/player-admin-command';
import './player/inventory/player-inventory.api';


import { getAccountByUsername } from './player/account/account.service';
import { AccountModel } from './player/account-character.ref';
import { WeaponItem } from './item/registry/weapon-item.model';


(async () => {
  new WeaponItem();
  const adminAccounts = [
    {
      username: 'Zekiloni',
      password: 'test',
      emailAddress: 'zekilonii@gmail.com',
      administrator: AdminType.SUPER_ADMIN,
      characters: []
    }
  ];

  adminAccounts.forEach((adminAccount) => {

    getAccountByUsername(adminAccount.username).then(async (alreadyExist) => {
      if (!alreadyExist) {
        await AccountModel.create({
          username: adminAccount.username,
          password: adminAccount.password,
          emailAddress: adminAccount.emailAddress,
          characters: adminAccount.characters,
          administrator: adminAccount.administrator
        });
      }
    });
  });
})();
