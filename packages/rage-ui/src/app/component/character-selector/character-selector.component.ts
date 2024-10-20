import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { IAccount, ICharacter } from '@bcrp-rage/common';


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
  account: Partial<IAccount> = {
    username: 'Zekiloni',
    characters: []
  };


  get characters(): Partial<ICharacter>[] {
    return [
      {
        firstName: 'Zachary',
        lastName: 'Parker',
        level: 1,
        lastSessionAt: new Date
      }
    ];
  }

  selectCharacter(id: string) {
    console.log('id');
  }
}
