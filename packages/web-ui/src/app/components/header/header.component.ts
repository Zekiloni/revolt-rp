import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Sidebar } from 'primeng/sidebar';
import { environment } from '../../../environments/environment';
import { AuthComponent } from '../auth';
import { PrimeTemplate } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [CommonModule, Dialog, Button, Sidebar, AuthComponent, PrimeTemplate],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  logoUrl = 'assets/logo.png'; // or 'images/logo.png' if in public folder

  wikiUrl = environment.wikiUrl;
  forumUrl = environment.forumUrl;

  openMobile = signal(false);
  showAuth = signal(false);

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
