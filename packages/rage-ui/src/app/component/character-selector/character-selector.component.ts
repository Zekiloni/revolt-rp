import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { ICharacter } from '@bcrp-rage/common';

@Component({
  selector: 'app-character-selector',
  standalone: true,
  imports: [
    Button
  ],
  templateUrl: './character-selector.component.html',
  styleUrl: './character-selector.component.css',
})
export class CharacterSelectorComponent {
  characters: Partial<ICharacter>[] = [
    {
      firstName: 'Zachary',
      lastName: 'Parker',
      id: 'ada'
    }
  ];

  selectCharacter(id: string) {
    console.log('id')
  }
}
