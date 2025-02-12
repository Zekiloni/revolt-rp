import dayjs from 'dayjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MeterGroupModule } from 'primeng/metergroup';
import { TreeTableModule } from 'primeng/treetable';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { bodyParts, IPlayer, IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';


@Component({
  selector: 'app-player-damage-info',
  standalone: true,
  imports: [CommonModule, TranslatePipe, MeterGroupModule, TreeTableModule, TableModule, Button],
  templateUrl: './player-damage-info.component.html',
  styleUrl: './player-damage-info.component.scss'
})
export class PlayerDamageInfoComponent implements OnInit, OnDestroy {
  playerName = '';
  damages: (IPlayerDamageData<IPlayer>)[] = [];

  constructor(private rageClientService: RageClientService) {
  }

  getBodyPartLabel(boneIndex: number) {
    return bodyParts.get(boneIndex) || 'unknown';
  }

  private setPlayerDamages = ([playerName, damages]: [string, IPlayerDamageData<IPlayer>[]]) => {
    this.playerName = playerName;
    this.damages = damages ?? [];
  };

  minutesAgo(timestamp: number) {
    return dayjs().diff(dayjs(timestamp), 'minute');
  }

  getDamageTextClass(value: number) {
    return value > 65 ? 'text-red-500' : value > 35 ? 'text-red-400' : 'text-red-300';
  }

  closeDamageInfo() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_TOGGLE_DAMAGE_INFO);
  }

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PLAYER_DAMAGES, this.setPlayerDamages);
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PLAYER_DAMAGES, this.setPlayerDamages);
  }
}
