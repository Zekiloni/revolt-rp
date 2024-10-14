import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { authorizeAccount, createAccount } from './account.service';
import { AccountCreate } from '@bc-rp-rage/shared/lib/account/account-create.model';
import { ProcedureKey } from '@bc-rp-rage/shared/lib/enums/procedure.enums';
import { AccountAuthorize } from '@bc-rp-rage/shared/lib/account/account-auth.model';

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