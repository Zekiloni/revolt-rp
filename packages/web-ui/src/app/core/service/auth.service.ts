import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAuthorizationState } from '../store/auth/auth.state';
import { HttpClient } from '@angular/common/http';
import { IAccount } from '@revolt-rp/common';
import { setAccount, unsetAccount } from '../store/auth/auth.actions';
import { API_BASE_HREF } from '@revolt-rp/common-ui';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    @Inject(API_BASE_HREF) private apiBaseHref: string,
    private httpClient: HttpClient,
    @Inject(Store) private store: Store<IAuthorizationState>) {
  }

  get apiBasePath() {
    return `${this.apiBaseHref}/auth`;
  }

  initializeAsync(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();

    return new Promise((resolve) => {
      const queryParams = new URLSearchParams(window.location.search);
      const queryToken = queryParams.get('token');
      const storedToken = localStorage.getItem('auth_token');
      const token = queryToken || storedToken;

      if (!token) {
        return resolve();
      }

      localStorage.setItem('auth_token', token);
      if (queryToken) {
        // Remove token from URL
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      this.getUserInfo().subscribe({
        next: (account) => {
          this.store.dispatch(setAccount({ account }));
          resolve();
        },
        error: () => {
          this.logout();
          resolve();
        }
      });
    });
  }

  discordOauth2() {
    window.location.href = `${this.apiBasePath}/oauth2/discord`;
  }

  basicAuth(username: string, password: string) {
    return this.httpClient.post(`${this.apiBasePath}/basic`, { username, password }, { observe: 'response', responseType: 'text'});
  }

  getUserInfo() {
    return this.httpClient.get<IAccount>(`${this.apiBasePath}/userinfo`);
  }


  logout() {
    localStorage.removeItem('auth_token');
    this.store.dispatch(unsetAccount());
    window.location.href = '/';
  }
}
