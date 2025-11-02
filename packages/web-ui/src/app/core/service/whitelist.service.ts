import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { IWhitelist, IWhiteListCreate, IWhitelistTest, WhitelistStatus } from '@revolt-rp/common';

@Injectable({ providedIn: 'root' })
export class WhitelistService extends BaseApiService {

  generateWhitelist() {
    return this.httpClient.get<IWhitelistTest>(`${this.getApiPath('whitelist')}`);
  }

  getWhitelistsByAccountId(accountId: string) {
    return this.httpClient.get<IWhitelist[]>(`${this.getApiPath('whitelist')}/${accountId}`);
  }

  createWhitelist(create: IWhiteListCreate) {
    return this.httpClient.post<IWhitelist>(this.getApiPath('whitelist'), create);
  }

  approveWhitelist(whitelistId: string) {
    return this.httpClient.patch<IWhitelist>(`${this.getApiPath('whitelist')}/${whitelistId}/approve`, {});
  }

  rejectWhitelist(whitelistId: string, note: string) {
    return this.httpClient.patch<IWhitelist>(`${this.getApiPath('whitelist')}/${whitelistId}/reject`, { note });
  }

  getAllWhitelists(status: WhitelistStatus, limit = 50, offset = 0) {
    return this.httpClient.get<{ total: number, whitelists: IWhitelist[]}>(this.getApiPath('whitelist'), {
      params: {
        status,
        limit: limit.toString(),
        offset: offset.toString()
      }
    });
  }
}
