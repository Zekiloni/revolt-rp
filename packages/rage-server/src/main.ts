import './core/mongo-db';
import './core/i18next.config';
import './player/account/account.api';
import './player/character/character.api';
import './player/player-join.api';

import { getAccountByUsername } from './player/account/account.service';
import { AccountModel } from './player/account/account.model';


(async () => {

  const adminAccounts = [
    {
      username: 'Zekiloni',
      password: 'test',
      emailAddress: 'zekilonii@gmail.com',
      characters: []
    }
  ];

  adminAccounts.forEach((adminAccount) => {

    getAccountByUsername(adminAccount.username).then((alreadyExist) => {
      if (!alreadyExist) {
        AccountModel.create({
          username: adminAccount.username,
          password: adminAccount.password,
          emailAddress: adminAccount.emailAddress,
          characters: adminAccount.characters
        });
      }
    });
  });
})();
