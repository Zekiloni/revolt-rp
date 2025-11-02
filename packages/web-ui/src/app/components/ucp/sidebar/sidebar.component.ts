import { Component, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { IAccount, ICharacter, IWhitelist } from '@revolt-rp/common';
import { AccountService } from '../../../core/service/account.service';
import { AsyncPipe } from '@angular/common';
import { Avatar } from 'primeng/avatar';
import { Ripple } from 'primeng/ripple';
import { Button } from 'primeng/button';
import { SideMenuItemComponent } from './components/side-menu-item';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    AsyncPipe,
    Avatar,
    Ripple,
    Button,
    SideMenuItemComponent
  ],
  providers: [AccountService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  @Input() accountId!: string;

  $account!: Observable<IAccount>;
  sideMenuItems: MenuItem[] = [];
  isDarkMode = false;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.getAccount();
  }

  private buildMenuItems = (account: IAccount<ICharacter, IWhitelist>) => {
    const isAdmin = this.hasAdminAccess(account);

    this.sideMenuItems = [
      {
        label: 'Main',
        icon: 'pi pi-fw pi-home',
        items: [
          {
            label: 'Account',
            icon: 'pi pi-fw pi-cog',
            routerLink: ['/dashboard']
          },
          {
            label: 'Whitelist Application',
            icon: 'pi pi-fw pi-file',
            badge: account.whitelist.length.toString(),
            routerLink: ['/dashboard', 'whitelist']
          },
          {
            label: 'Characters',
            icon: 'pi pi-fw pi-users',
            items: [...account.characters.map((character) => ({
              label: character.fullName,
              icon: 'pi pi-fw pi-user',
              routerLink: ['/dashboard', 'character', character.id]
            }))]
          }
        ]
      },
      ...(isAdmin
          ? [
            {
              label: 'Administration',
              icon: 'pi pi-fw pi-lock',
              items: [
                {
                  label: 'Entity Management',
                  icon: 'pi pi-shield',
                  items: [
                    { label: 'Manage users', icon: 'pi pi-users', routerLink: ['/admin/users'] },
                    { label: 'Manage properties', icon: 'pi pi-home', routerLink: ['/admin/properties'] },
                    { label: 'Manage factions', icon: 'pi pi-shield', routerLink: ['/admin/factions'] },
                    { label: 'Manage vehicles', icon: 'pi pi-car', routerLink: ['/admin/vehicles'] }
                  ]
                },
                { label: 'Whitelist Applications', icon: 'pi pi-file', routerLink: ['/admin/applications'] }
              ]
            }
          ]
          : []
      ),
      {
        label: 'Other',
        icon: 'pi pi-fw pi-ellipsis-h',
        items: [
          {
            label: 'Interactive Map',
            icon: 'pi pi-fw pi-map',
            routerLink: ['/ucp', account.id, 'map']
          },
          {
            label: 'Statistics',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/ucp', account.id, 'stats']
          }
        ]
      }
    ];
  };

  private hasAdminAccess(account: IAccount): boolean {
    return account.administrator > 0;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('app-dark', this.isDarkMode);
  }

  getAccount() {
    this.$account = this.accountService.getAccount(this.accountId).pipe(
      tap((account) => this.buildMenuItems(account))
    );
  }
}
