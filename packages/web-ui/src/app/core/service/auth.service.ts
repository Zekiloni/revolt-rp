import { Inject, Injectable } from '@angular/core';
import { API_BASE_HREF } from '../config/variables';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAuthorizationState } from '../store/auth/auth.state';
import { HttpClient } from '@angular/common/http';
import { IAccount } from '@revolt-rp/common';
import { setAccount, unsetAccount } from '../store/auth/auth.actions';


@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    @Inject(API_BASE_HREF) private apiBaseHref: string,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    @Inject(Store) private store: Store<IAuthorizationState>) {
  }

  get apiBasePath() {
    return `${this.apiBaseHref}/auth`;
  }

  initialize() {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        console.log('AuthService detected token in query params:', params['token']);
        localStorage.setItem('auth_token', params['token']);

        this.getUserInfo().subscribe({
          next: (account) => {
            window.history.replaceState({}, document.title, window.location.pathname);
            this.store.dispatch(setAccount({ account }));
          },
          error: () =>
            this.logout()
        });
      }
    });
  }

  discordOauth2() {
    window.location.href = `${this.apiBasePath}/oauth2/discord`;
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
