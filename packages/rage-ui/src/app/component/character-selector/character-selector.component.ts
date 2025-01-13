import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { IAccount, ICharacter, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { calculateLevelUpQuota } from '../../../../../common/src/lib/util/player-level.util';


@Component({
  selector: 'app-character-selector',
  standalone: true,
  imports: [
    Button,
    KnobModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './character-selector.component.html',
  styleUrl: './character-selector.component.css'
})
export class CharacterSelectorComponent {
  @Input() account!: Partial<IAccount>;


  constructor(private rageClientService: RageClientService) {
  }

  get characters() {
    return this.account.characters as ICharacter[];
  }

  selectCharacter(character: ICharacter) {
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_SELECT_CHARACTER, character.id);
  }

  createCharacter() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, true)
  }

  protected readonly calculateLevelUpQuota = calculateLevelUpQuota;
}
