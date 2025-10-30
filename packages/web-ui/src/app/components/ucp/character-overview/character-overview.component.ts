import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../../core/service/character.service';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICharacter } from '@revolt-rp/common';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-character-overview',
  standalone: true,
  imports: [
    Menubar,
    AsyncPipe,
    JsonPipe
  ],
  providers: [CharacterService],
  templateUrl: './character-overview.component.html',
  styleUrl: './character-overview.component.css'
})
export class CharacterOverviewComponent implements OnInit{
  $character!: Observable<ICharacter>;

  items: MenuItem[] = [
    {
      label: 'Overview',
      icon: 'pi pi-fw pi-info-circle',
      routerLink: ['/dashboard/character/overview']
    },
    {
      label: 'Inventory',
      icon: 'pi pi-fw pi-box',
      routerLink: ['/dashboard/character/inventory']
    },
    {
      label: 'Skills',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/dashboard/character/skills']
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      routerLink: ['/dashboard/character/settings']
    }
  ];

  constructor(private route: ActivatedRoute,private characterService: CharacterService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const characterId = params['characterId'];
      this.$character = this.characterService.getCharacter(characterId);
    })

  }
}
