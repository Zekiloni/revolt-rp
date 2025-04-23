import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IOnlinePlayer, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';


/**
 * Component to display the online players in the player menu.
 */
@Component({
  selector: 'app-online-players',
  standalone: true,
  imports: [CommonModule, TableModule, Button, TranslatePipe],
  templateUrl: './online-players.component.html',
  styleUrl: './online-players.component.css'
})
export class OnlinePlayersComponent {
  $players!: Observable<IOnlinePlayer[]>;

  constructor(private rageClientService: RageClientService) {
    this.getPlayers();
  }

  private getPlayers() {
    this.$players = this.rageClientService.callServer<IOnlinePlayer[]>(ProcedureKey.SERVER_GET_PLAYERS);
  }

  refresh() {
    this.getPlayers();
  }
}
