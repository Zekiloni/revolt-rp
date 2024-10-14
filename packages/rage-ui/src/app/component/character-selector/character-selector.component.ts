import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Character } from '@bc-rp-rage/shared/lib/character/character.model';

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
  characters: Partial<Character>[] = [
    {
      firstName: 'Zachary',
      lastName: 'Parker',
      id: 'ada'
    }
  ];

  selectCharacter(id: string) {

  }
}
