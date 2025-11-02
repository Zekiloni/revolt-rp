import { Component } from '@angular/core';
import { MainHeroComponent } from '../../components/main-hero';
import { StartPlayingComponent } from '../../components/start-playing/start-playing.component';
import { LinksComponent } from '../../components/links/links.component';

@Component({
  selector: 'app-home-page',
  imports: [
    MainHeroComponent,
    StartPlayingComponent,
    LinksComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
