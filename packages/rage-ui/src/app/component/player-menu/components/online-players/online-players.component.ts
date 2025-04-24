import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IOnlinePlayer, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { filterGlobal } from '../../../../domain/util/table.util';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';


/**
 * Component to display the online players in the player menu.
 */
@Component({
  selector: 'app-online-players',
  standalone: true,
  imports: [CommonModule, TableModule, Button, TranslatePipe, IconFieldModule, InputIconModule, InputTextModule],
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

  protected readonly filterGlobal = filterGlobal;

  getNickNameColor(player: IOnlinePlayer) {
    switch (true) {
      case player.administrator === 1:
        return 'text-green-400';
      case player.administrator > 1:
        return 'text-red-400';
      default:
        return 'text-color';
    }
  }
}
