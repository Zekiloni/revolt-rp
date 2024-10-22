import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { IAccount, ICharacter, ProcedureKey } from '@bcrp-rage/common';
import { RageClientService } from '../../domain/service/rage-client.service';


@Component({
  selector: 'app-character-selector',
  standalone: true,
  imports: [
    Button
  ],
  templateUrl: './character-selector.component.html',
  styleUrl: './character-selector.component.css'
})
export class CharacterSelectorComponent {
  @Input() account!: IAccount;


  constructor(private rageClientService: RageClientService) {
  }

  get characters() {
    return this.account.characters as ICharacter[];
  }

  selectCharacter(id: string) {
    console.log('id');
  }

  createCharacter() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, true)
  }
}
