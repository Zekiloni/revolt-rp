import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { AccountAuthorize, AccountCreate, ProcedureKey, catchError } from '@revolt-rp/common';
import { authorizeAccount, createAccount } from './account.service';
import { discordOAuth2 } from './oauth2.service';


async function playerCreateAccountHandler(accountCreate: AccountCreate, info: ProcedureListenerInfo) {
  return createAccount(accountCreate, info)
    .then(account => account)
    .catch(catchError);
}

async function playerAuthorizeAccountHandler(authorize: AccountAuthorize, { player }: ProcedureListenerInfo<PlayerMp>) {
  return authorizeAccount(player, authorize.username, authorize.password)
    .then(result => result)
    .catch(catchError);
}


async function playerDiscordAuthorizeAccountHandler(authorizationCode: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  console.log('playerDiscordAuthorizeAccountHandler')
  return discordOAuth2(authorizationCode)
    .then(result => {
      console.log('Discord Profile', result);
      return result;
    })
    .catch(catchError);
}

register(ProcedureKey.SERVER_PLAYER_CREATE_ACCOUNT, playerCreateAccountHandler);
register(ProcedureKey.SERVER_PLAYER_AUTHORIZE, playerAuthorizeAccountHandler);
register(ProcedureKey.SERVER_PLAYER_AUTHORIZE_DISCORD, playerDiscordAuthorizeAccountHandler);
