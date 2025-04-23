import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-online-players',
  standalone: true,
  imports: [CommonModule, TableModule, Button, TranslatePipe],
  templateUrl: './online-players.component.html',
  styleUrl: './online-players.component.css',
})
export class OnlinePlayersComponent {
  players: any[] = [];
}
