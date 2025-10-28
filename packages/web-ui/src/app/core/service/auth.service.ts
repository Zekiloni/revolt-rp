import { Inject, Injectable } from '@angular/core';
import { API_BASE_HREF } from '../config/variables';


@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(@Inject(API_BASE_HREF) private apiBaseHref: string) {
  }

  get apiBasePath() {
    return `${this.apiBaseHref}/auth`;
  }

  discordAuth() {
    window.location.href = `${this.apiBasePath}/oauth2/discord`;
  }
}
