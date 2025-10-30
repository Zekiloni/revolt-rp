import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-hero.component.html',
  styleUrl: './main-hero.component.css',
})
export class MainHeroComponent {
  count = 5;
  heights = ['80%', '90%', '85%', '75%'];
  widths = ['25%', '30%', '30%', '20%']
}
