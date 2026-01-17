import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Sidebar } from 'primeng/sidebar';
import { environment } from '../../../environments/environment';
import { AuthComponent } from '../auth';
import { Store } from '@ngrx/store';
import { IAuthorizationState } from '../../core/store/auth/auth.state';
import { Observable } from 'rxjs';
import { IAccount } from '@revolt-rp/common';
import { selectAccount } from '../../core/store/auth/auth.selector';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/service/auth.service';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-header',
  imports: [CommonModule, Dialog, Button, Sidebar, AuthComponent, RouterLink, Menu],
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

  constructor(
    @Inject(Store) private store: Store<IAuthorizationState>,
    private authService: AuthService
  ) {
    this.$account = this.store.select(selectAccount)
  }

  accountMenuItems: MenuItem[] | undefined = [
    {
      label: 'Toggle Dark Mode',
      icon: 'pi pi-moon',
      command: () => this.toggleTheme()
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      iconStyle: { 'color': 'red' },
      command: () => this.authService.logout()
    }
  ];

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


  private toggleTheme() {
    const element = document.documentElement;
    if (element.classList.contains('dark')) {
      console.log('removing dark mode');
      element.classList.remove('dark');
    } else {
      console.log('adding dark mode');
      element.classList.add('dark');
    }
  }
}
