import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { AccountAuthorize, AccountCreate, ProcedureKey } from '@bcrp-rage/common';
import { authorizeAccount, createAccount } from './account.service';


async function playerCreateAccountHandler(accountCreate: AccountCreate, info: ProcedureListenerInfo) {
	return createAccount(accountCreate, info)
		.then(account => account)
		.catch(reason => reason);
}

async function playerAuthorizeAccountHandler(authorize: AccountAuthorize) {
	return authorizeAccount(authorize.username, authorize.password)
		.then(result => result)
		.catch(reason => reason);
}

register(ProcedureKey.SERVER_PLAYER_CREATE_ACCOUNT, playerCreateAccountHandler);
register(ProcedureKey.SERVER_PLAYER_AUTHORIZE, playerAuthorizeAccountHandler);
