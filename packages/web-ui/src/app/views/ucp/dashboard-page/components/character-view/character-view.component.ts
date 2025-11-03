import { Component } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-character-page',
  standalone: true,
  imports: [
    Menubar,
    RouterOutlet
  ],
  templateUrl: './character-view.component.html',
  styleUrl: './character-view.component.css'
})
export class CharacterViewComponent {
  items: MenuItem[] = [
    {
      label: 'Overview',
      icon: 'pi pi-fw pi-car',
      routerLink: ['./']
    },
    {
      label: 'Vehicles',
      icon: 'pi pi-fw pi-car',
      routerLink: ['vehicles']
    },
    // {
    //   label: 'Properties',
    //   icon: 'pi pi-fw pi-building',
    //   routerLink: ['/dashboard/character/settings']
    // },
    // {
    //   label: 'Skills',
    //   icon: 'pi pi-fw pi-star',
    //   routerLink: ['/dashboard/character/skills']
    // },
    // {
    //   label: 'Settings',
    //   icon: 'pi pi-fw pi-cog',
    //   routerLink: ['/dashboard/character/settings']
    // }
  ];
}
