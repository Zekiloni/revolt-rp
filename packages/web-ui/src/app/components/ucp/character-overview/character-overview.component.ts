import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../../core/service/character.service';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICharacter, IOrganization, IOrganizationRank } from '@revolt-rp/common';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-character-overview',
  standalone: true,
  imports: [
    Menubar,
    AsyncPipe,
    CurrencyPipe,
    NgClass
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

  storeItems = [
    { name: 'Name Change', price: '$9.99', icon: 'pi-id-card' },
    { name: 'Vehicle Plate Change', price: '$6.99', icon: 'pi-car' },
    { name: 'Character Slot', price: '$12.99', icon: 'pi-user-plus' },
    { name: 'Phone Number Change', price: '$4.99', icon: 'pi-mobile' }
  ];

  constructor(private route: ActivatedRoute,private characterService: CharacterService) {
  }


  getOrganization(character: ICharacter) {
    return character.membership?.organization as IOrganization;
  }

  getRank(character: ICharacter) {
    return character.membership?.rank as IOrganizationRank;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const characterId = params['characterId'];
      this.$character = this.characterService.getCharacter(characterId);
    })

  }
}
