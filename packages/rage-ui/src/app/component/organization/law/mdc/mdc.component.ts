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
import { GangRecordComponent } from './components/gang-record';
import { StaticAssetPipe } from '../../../../domain/pipe/static-asset.pipe';
import { dockMenuItems, MdcApplicationKey, menubarItems, responsiveOptions } from './mdc.component.config';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { GameUiKey, ProcedureKey } from '@revolt-rp/common';
import { FinderComponent } from './components/finder';


@Component({
  selector: 'app-mdc',
  standalone: true,
  imports: [CommonModule, MenubarModule, DockModule, DialogModule, ToastModule, TerminalModule, TreeModule, TranslatePipe, Ripple, GangRecordComponent, StaticAssetPipe, FinderComponent],
  providers: [MessageService, TerminalService],
  templateUrl: './mdc.component.html',
  styleUrl: './mdc.component.scss'
})
export class MdcComponent implements OnInit, OnDestroy {
  @Input() isActive!: boolean;

  openedApplications: Set<MdcApplicationKey> = new Set<MdcApplicationKey>();

  dockItems: MenuItem[] = dockMenuItems(this.openApplication.bind(this));

  menubarItems!: MenuItem[];

  responsiveOptions = responsiveOptions;

  images: any[] | undefined;

  nodes: any[] | undefined;

  subscription: Subscription | undefined;

  constructor(private rageClientService: RageClientService, private messageService: MessageService, private terminalService: TerminalService) {
    this.menubarItems = [
      ...menubarItems(this.openApplication.bind(this)),
      {
        label: 'quit',
        icon: 'pi pi-fw pi-times-circle',
        command: () => this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.MDC)
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

  openApplication(key: MdcApplicationKey) {
    this.openedApplications.add(key);
  }

  closeApplication(key: MdcApplicationKey) {
    this.openedApplications.delete(key);
  }

  ngOnInit() {

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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
