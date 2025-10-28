import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header';
import { MainHeroComponent } from '../../components/main-hero/main-hero.component';
import { StartPlayingComponent } from '../../components/start-playing/start-playing.component';
import { LinksComponent } from '../../components/links/links.component';

@Component({
  selector: 'app-home-page',
  imports: [
    HeaderComponent,
    MainHeroComponent,
    StartPlayingComponent,
    LinksComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
