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
  shapes = [
    "polygon(6% 0%, 98% 3%, 94% 100%, 2% 97%)",
    "polygon(2% 1%, 100% 0%, 98% 100%, 4% 99%)",
    "polygon(3% 2%, 98% 0%, 100% 100%, 0% 98%)",
    "polygon(0% 3%, 96% 0%, 100% 100%, 4% 99%)",
  ];

  heights = ['82%', '90%', '86%', '78%'];
  rotates = ['1deg', '1deg', '1deg', '3deg'];
}
