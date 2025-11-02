import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header';
import { FooterComponent } from './components/footer';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './core/service/auth.service';
import { Toast } from 'primeng/toast';

@Component({
  imports: [RouterModule, HeaderComponent, FooterComponent, Toast],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'web-ui';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.querySelector('html');

      if (element) {
        element.classList.toggle('app-dark');
      }
    }
  }
}
