import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Sidebar } from 'primeng/sidebar';
import { environment } from '../../../environments/environment';
import { AuthComponent } from '../auth';
import { PrimeTemplate } from 'primeng/api';
import { Store } from '@ngrx/store';
import { IAuthorizationState } from '../../core/store/auth/auth.state';
import { Observable } from 'rxjs';
import { IAccount } from '@revolt-rp/common';
import { selectAccount } from '../../core/store/auth/auth.selector';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, Dialog, Button, Sidebar, AuthComponent, PrimeTemplate, RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  wikiUrl = environment.wikiUrl;
  forumUrl = environment.forumUrl;

  openMobile = signal(false);
  showAuth = signal(false);

  $account: Observable<IAccount | null>;

  constructor(@Inject(Store) private store: Store<IAuthorizationState>) {
    this.$account = this.store.select(selectAccount)
  }

  toggleMobile() {
    this.openMobile.update(v => !v);
  }

  closeMobile() {
    this.openMobile.set(false);
  }

  openLoginModal() {
    this.showAuth.set(true);
  }


  openAuth() {
    this.showAuth.set(true);
  }

  closeAuth() {
    this.showAuth.set(false);
  }


  onMobileRegister() {
    this.closeMobile();
    this.openAuth();
  }

  onMobileLogin() {
    this.closeMobile();
    this.openLoginModal();
  }

}
