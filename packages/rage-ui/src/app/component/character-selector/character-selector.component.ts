import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IAccount, ICharacter, ProcedureKey, calculateLevelUpQuota } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';
import { TranslatePipe } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-character-selector',
  standalone: true,
  imports: [
    Button,
    KnobModule,
    FormsModule,
    DatePipe,
    TranslatePipe,
    TooltipModule
  ],
  templateUrl: './character-selector.component.html',
  styleUrl: './character-selector.component.css'
})
export class CharacterSelectorComponent {
  protected readonly calculateLevelUpQuota = calculateLevelUpQuota;

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
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, true);
  }
}
