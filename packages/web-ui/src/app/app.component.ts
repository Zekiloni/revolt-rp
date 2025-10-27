import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { MainHeroComponent } from './components/main-hero/main-hero.component';

@Component({
  imports: [NxWelcomeComponent, RouterModule, MainHeroComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'web-ui';
}
