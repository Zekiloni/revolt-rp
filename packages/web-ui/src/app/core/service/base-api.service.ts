import { Inject, Injectable } from '@angular/core';
import { API_BASE_HREF } from '@revolt-rp/common-ui';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root'})
export abstract class BaseApiService {

  constructor(
    @Inject(API_BASE_HREF) protected apiBaseHref: string,
    protected httpClient: HttpClient) {
  }

  protected getApiPath(segment: string): string {
    return `${this.apiBaseHref}/${segment}`;
  }
}
