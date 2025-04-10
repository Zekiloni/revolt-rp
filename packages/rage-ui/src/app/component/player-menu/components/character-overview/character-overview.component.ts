import { Observable } from 'rxjs';
import { Component, ViewEncapsulation } from '@angular/core';
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


@Component({
  selector: 'app-character-overview',
  standalone: true,
  imports: [CommonModule, TranslatePipe, AvatarModule, TagModule, KnobModule, FormsModule, TooltipModule, FileUploadModule],
  templateUrl: './character-overview.component.html',
  styleUrl: './character-overview.component.css'
})
export class CharacterOverviewComponent {
  protected readonly calculateLevelUpQuota = calculateLevelUpQuota;

  $character!: Observable<ICharacter>;

  constructor(private rageClientService: RageClientService) {
    this.getCharacter();
  }

  private getCharacter() {
    this.$character = this.rageClientService.callServer<ICharacter>(ProcedureKey.SERVER_GET_PLAYER_CHARACTER);
  }

  getLevelUpLeft(hours: number, minutes: number, levelUpQuota: number) {
    const currentTotalMinutes = (hours * 60) + minutes;
    const requiredTotalMinutes = levelUpQuota * 60;
    const remainingMinutes = requiredTotalMinutes - currentTotalMinutes;

    return dayjs().add(remainingMinutes, 'minutes').fromNow();
  }

  getInitials(fullName: string) {
    const names = fullName.split(' ');
    const firstName = names[0].charAt(0).toUpperCase();
    const lastName = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
    return `${firstName}${lastName}`;
  }
}
