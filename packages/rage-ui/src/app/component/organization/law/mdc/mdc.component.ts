import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { DockModule } from 'primeng/dock';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { TerminalModule, TerminalService } from 'primeng/terminal';
import { Subscription } from 'rxjs';
import { TreeModule } from 'primeng/tree';
import { TranslatePipe } from '@ngx-translate/core';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-mdc',
  standalone: true,
  imports: [CommonModule, MenubarModule, DockModule, DialogModule, ToastModule, TerminalModule, TreeModule, TranslatePipe, Ripple],
  providers: [MessageService, TerminalService],
  templateUrl: './mdc.component.html',
  styleUrl: './mdc.component.scss'
})
export class MdcComponent implements OnInit, OnDestroy {
  @Input() isActive!: boolean;

  displayTerminal = false;

  displayFinder = false;

  displayGalleria: boolean | undefined;

  dockItems: MenuItem[] = [];

  menubarItems: any[] = [];

  responsiveOptions: any[] | undefined;

  images: any[] | undefined;

  nodes: any[] | undefined;

  subscription: Subscription | undefined;

  constructor(private messageService: MessageService, private terminalService: TerminalService) {
  }

  ngOnInit() {
    this.dockItems = [
      {
        label: 'Finder',
        tooltipOptions: {
          tooltipLabel: 'Finder',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg',
        command: () => {
          this.displayFinder = true;
        }
      },
      {
        label: 'Terminal',
        tooltipOptions: {
          tooltipLabel: 'Terminal',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/terminal.svg',
        command: () => {
          this.displayTerminal = true;
        }
      },
      {
        label: 'App Store',
        tooltipOptions: {
          tooltipLabel: 'App Store',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg',
        command: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'An unexpected error occurred while signing in.',
            detail: 'UNTRUSTED_CERT_TITLE',
            key: 'mdc'
          });
        }
      },
      {
        label: 'Safari',
        tooltipOptions: {
          tooltipLabel: 'Safari',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/safari.svg',
        command: () => {
          this.messageService.add({ severity: 'warn', summary: 'Safari has stopped working', key: 'mdc' });
        }
      },
      {
        label: 'Trash',
        tooltipOptions: {
          tooltipLabel: 'Trash',
          tooltipPosition: 'top',
          positionTop: -15,
          positionLeft: 15,
          showDelay: 1000
        },
        icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png',
        command: () => {
          this.messageService.add({ severity: 'info', summary: 'Empty Trash', key: 'mdc' });
        }
      }
    ];

    this.menubarItems = [
      {
        label: 'Mobile Data Computer',
        styleClass: 'menubar-root font-bold'
      },
      {
        label: 'records',
        items: [
          {
            label: 'new',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'warrant',
                icon: 'pi pi-fw pi-bookmark'
              },
              {
                label: 'criminal_record',
                icon: 'pi pi-fw pi-video'
              }
            ]
          },
          {
            label: 'active_warrants',
            icon: 'pi pi-fw pi-trash'
          },
          {
            separator: true
          },
          {
            label: 'in_custody',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      },
      {
        label: 'search',
        items: [

          {
            label: 'search_citizen',
            icon: 'pi pi-fw pi-users'
          },
          {
            label: 'search_vehicle',
            icon: 'pi pi-fw pi-car'
          }
        ]
      },
      {
        label: 'officers',
        items: [
          {
            label: 'on_duty',
            icon: 'pi pi-fw pi-user-plus'
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-users',
            items: [
              {
                label: 'Filter',
                icon: 'pi pi-fw pi-filter',
                items: [
                  {
                    label: 'Print',
                    icon: 'pi pi-fw pi-print'
                  }
                ]
              },
              {
                icon: 'pi pi-fw pi-bars',
                label: 'List'
              }
            ]
          }
        ]
      },
      {
        label: 'quit'
      }
    ];

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];

    this.subscription = this.terminalService.commandHandler.subscribe((command) => this.commandHandler(command));

    this.nodes = [
      {
        key: '0',
        label: 'Documents',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
          {
            key: '0-0',
            label: 'Work',
            data: 'Work Folder',
            icon: 'pi pi-fw pi-cog',
            children: [
              { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
              { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
            ]
          },
          {
            key: '0-1',
            label: 'Home',
            data: 'Home Folder',
            icon: 'pi pi-fw pi-home',
            children: [{
              key: '0-1-0',
              label: 'Invoices.txt',
              icon: 'pi pi-fw pi-file',
              data: 'Invoices for this month'
            }]
          }
        ]
      },
      {
        key: '1',
        label: 'Events',
        data: 'Events Folder',
        icon: 'pi pi-fw pi-calendar',
        children: [
          { key: '1-0', label: 'Meeting', icon: 'pi pi-fw pi-calendar-plus', data: 'Meeting' },
          { key: '1-1', label: 'Product Launch', icon: 'pi pi-fw pi-calendar-plus', data: 'Product Launch' },
          { key: '1-2', label: 'Report Review', icon: 'pi pi-fw pi-calendar-plus', data: 'Report Review' }
        ]
      },
      {
        key: '2',
        label: 'Movies',
        data: 'Movies Folder',
        icon: 'pi pi-fw pi-star-fill',
        children: [
          {
            key: '2-0',
            icon: 'pi pi-fw pi-star-fill',
            label: 'Al Pacino',
            data: 'Pacino Movies',
            children: [
              { key: '2-0-0', label: 'Scarface', icon: 'pi pi-fw pi-video', data: 'Scarface Movie' },
              { key: '2-0-1', label: 'Serpico', icon: 'pi pi-fw pi-video', data: 'Serpico Movie' }
            ]
          },
          {
            key: '2-1',
            label: 'Robert De Niro',
            icon: 'pi pi-fw pi-star-fill',
            data: 'De Niro Movies',
            children: [
              { key: '2-1-0', label: 'Goodfellas', icon: 'pi pi-fw pi-video', data: 'Goodfellas Movie' },
              {
                key: '2-1-1',
                label: 'Untouchables',
                icon: 'pi pi-fw pi-video',
                data: 'Untouchables Movie',
                selectable: false
              }
            ]
          }
        ]
      }
    ];
  }

  commandHandler(text: any) {
    let response;
    const argsIndex = text.indexOf(' ');
    const command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

    switch (command) {
      case 'date':
        response = 'Today is ' + new Date().toDateString();
        break;

      case 'greet':
        response = 'Hola ' + text.substring(argsIndex + 1) + '!';
        break;

      case 'random':
        response = Math.floor(Math.random() * 100);
        break;

      default:
        response = 'Unknown command: ' + command;
        break;
    }

    if (response) {
      this.terminalService.sendResponse(response as string);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
