import { AdminType } from '@revolt-rp/common';
import { getAccountByUsername } from '../player/account/account.service';
import { AccountModel } from '../player/account-character.ref';


(async () => {
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
