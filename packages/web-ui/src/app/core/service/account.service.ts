import { Injectable } from '@angular/core';
import { IAccount, IBan, ICharacter, IKick, IWhitelist } from '@revolt-rp/common';
import { BaseApiService } from './base-api.service';


@Injectable({ providedIn: 'root' })
export class AccountService extends BaseApiService {

  getAccount(accountId: string) {
    return this.httpClient.get<IAccount<ICharacter, IWhitelist>>(`${this.getApiPath('account')}/${accountId}`);
  }

  getAccountBanLogs(accountId: string, limit = 50, offset = 0) {
    return this.httpClient.get<{ total: number; bans: IBan[] }>(`${this.getApiPath('account')}/${accountId}/bans`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    });
  }

  getAccountKickLogs(accountId: string, limit = 50, offset = 0) {
    return this.httpClient.get<{ total: number; kicks: IKick[] }>(`${this.getApiPath('account')}/${accountId}/kicks`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    });
  }
}
