import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-player-offer',
  standalone: true,
  imports: [CommonModule, CardModule, TranslatePipe, Button],
  templateUrl: './player-offer.component.html',
  styleUrl: './player-offer.component.css'
})
export class PlayerOfferComponent {
  description = 'This is a player offer component.';
}
