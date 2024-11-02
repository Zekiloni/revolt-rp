import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hud.component.html',
  styleUrl: './hud.component.css',
})
export class HudComponent {
  remoteId = 1;
  onlinePlayersCount = 3;
  money = 666.99;
  streetName = 'Street Name';
  zoneName = 'Zone Name'
  headingTo = 'N'
}
