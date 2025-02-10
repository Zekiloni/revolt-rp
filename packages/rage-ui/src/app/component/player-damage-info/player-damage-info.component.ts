import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPlayer, IPlayerDamageData, ProcedureKey, getBoneNameByIndex } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';


@Component({
  selector: 'app-player-damage-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-damage-info.component.html',
  styleUrl: './player-damage-info.component.scss'
})
export class PlayerDamageInfoComponent implements OnInit, OnDestroy {
  damages: (IPlayerDamageData<IPlayer> & { boneName: string })[] = [];

  constructor(private rageClientService: RageClientService) {
  }

  private getTotalDamage(boneName: string): number {
    return this.damages
      .filter(damage => damage.boneName === boneName)
      .reduce((sum, damage) => sum + damage.damage, 0);
  }


  private getDamageColor(totalDamage: number): string {
    const root = document.documentElement;
    if (totalDamage == 0)
      return getComputedStyle(root).getPropertyValue('--surface-section');
    else if (totalDamage > 0 && totalDamage < 20) {
      return getComputedStyle(root).getPropertyValue('--red-200');
    } else if (totalDamage < 50) {
      return getComputedStyle(root).getPropertyValue('--red-400');
    } else if (totalDamage < 100) {
      return getComputedStyle(root).getPropertyValue('--red-500');
    } else {
      return getComputedStyle(root).getPropertyValue('--red-700');
    }
  }

  getDamage(boneName: string) {
    const totalDamage = this.getTotalDamage(boneName);
    return this.getDamageColor(totalDamage);
  }

  getDamages(boneNames: string[]) {
    const totalDamage = boneNames.map(boneName => this.getTotalDamage(boneName))
      .reduce((sum, damage) => sum + damage, 0);
    return this.getDamageColor(totalDamage);
  }

  private setPlayerDamages = (damages: IPlayerDamageData<IPlayer>[]) => {
    this.damages = damages.map(damage => ({ ...damage, boneName: getBoneNameByIndex(damage.boneIndex) ?? 'unknown' }));
  };

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_SET_PLAYER_DAMAGES, this.setPlayerDamages);
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PLAYER_DAMAGES, this.setPlayerDamages);
  }
}
