import { Observable, tap } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calculateLevelUpQuota, ICharacter, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { dayjs } from '../../../../domain/util/dajys.util';
import { ProgressBar } from 'primeng/progressbar';


@Component({
  selector: 'app-character-overview',
  standalone: true,
  imports: [CommonModule, TranslatePipe, AvatarModule, TagModule, KnobModule, FormsModule, TooltipModule, FileUploadModule, ProgressBar],
  templateUrl: './character-overview.component.html',
  styleUrl: './character-overview.component.css'
})
export class CharacterOverviewComponent {
  $character!: Observable<ICharacter>;

  levelUpQuota = 0;

  constructor(private rageClientService: RageClientService) {
    this.getCharacter();
  }

  private getCharacter() {
    this.$character = this.rageClientService.callServer<ICharacter>(ProcedureKey.SERVER_GET_PLAYER_CHARACTER)
      .pipe(
        tap(character => {
          if (character) {
            this.levelUpQuota = calculateLevelUpQuota(character.level + 1);
          }
        })
      );
  }

  getLevelUpLeft(hours: number, minutes: number, levelUpQuota: number) {
    const currentTotalMinutes = (hours * 60) + minutes;
    const requiredTotalMinutes = levelUpQuota * 60;
    const remainingMinutes = requiredTotalMinutes - currentTotalMinutes;

    return dayjs().to(dayjs().add(remainingMinutes, 'minutes'));
  }

  getInitials(fullName: string) {
    const names = fullName.split(' ');
    const firstName = names[0].charAt(0).toUpperCase();
    const lastName = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
    return `${firstName}${lastName}`;
  }
}
