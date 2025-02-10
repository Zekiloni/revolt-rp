import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaliberType, IPlayer, IPlayerDamageData } from '@revolt-rp/common';
import { getBoneIndexByName, getBoneNameByIndex } from '../../../../../common/src/lib/player/ped/body-parts';

@Component({
  selector: 'app-player-damage-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-damage-info.component.html',
  styleUrl: './player-damage-info.component.scss'
})
export class PlayerDamageInfoComponent {

  damages: (IPlayerDamageData<IPlayer> & { boneName: string})[] = [
    {
      boneIndex: 6,
      caliberType: CaliberType.CALIBER_9_MM,
      damage: 5,
      weaponHash: 3424,
      source: { name: 'John Doe', id: 1 },
      boneName: 'IK_L_Foot'
    },
    {
      boneIndex: 6,
      caliberType: CaliberType.CALIBER_9_MM,
      damage: 5,
      weaponHash: 3424,
      source: { name: 'John Doe', id: 1 },
      boneName: 'IK_L_Foot'
    }
  ];

  constructor() {
    const root = document.documentElement;
    console.log(getComputedStyle(root).getPropertyValue('--red-200'))
  }

  getTotalDamage(boneName: string): number {
    return this.damages
      .filter(damage => damage.boneName === boneName)
      .reduce((sum, damage) => sum + damage.damage, 0);
  }


  getDamageColor(totalDamage: number): string {
    const root = document.documentElement;
    console.log(totalDamage)
    if (totalDamage == 0)
      return getComputedStyle(root).getPropertyValue('--green-500');
    else if (totalDamage > 0 && totalDamage < 20) {
      return getComputedStyle(root).getPropertyValue('--red-200');
    } else if (totalDamage < 50) {
      return getComputedStyle(root).getPropertyValue('--red-400');
    } else if (totalDamage < 100) {
      return getComputedStyle(root).getPropertyValue('--red-500');
    } else {
      return getComputedStyle(root).getPropertyValue('--red-700')
    }
  }

  getDamage(boneName: string) {
    const totalDamage = this.getTotalDamage(boneName!);
    return this.getDamageColor(totalDamage);
  }
}
