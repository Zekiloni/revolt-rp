import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { DockModule } from 'primeng/dock';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { Terminal, TerminalModule, TerminalService } from 'primeng/terminal';
import { delay, of, Subscription, switchMap } from 'rxjs';
import { TreeModule } from 'primeng/tree';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Ripple } from 'primeng/ripple';
import { GangRecordComponent } from './components/gang-record';
import { dockMenuItems, MdcApplicationKey, menubarItems, responsiveOptions } from './mdc.component.config';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { ApiError, GameUiKey, IVector3, ProcedureKey } from '@revolt-rp/common';
import { FinderComponent } from './components/finder';
import { StaticAssetPipe } from '@revolt-rp/common-ui';
import { DialogService } from 'primeng/dynamicdialog';
import { TrackPhoneNumberComponent, TrackPhoneNumberData } from './components/track-phone-number';


@Component({
  selector: 'app-mdc',
  standalone: true,
  imports: [CommonModule, MenubarModule, DockModule, DialogModule, ToastModule, TerminalModule, TreeModule, TranslatePipe, Ripple, GangRecordComponent, StaticAssetPipe, FinderComponent],
  providers: [MessageService, TerminalService, DialogService],
  templateUrl: './mdc.component.html',
  styleUrl: './mdc.component.scss'
})
export class MdcComponent implements OnInit, OnDestroy {
  @Input() isActive!: boolean;
  @ViewChild('terminal') terminal!: Terminal;

  openedApplications: Set<MdcApplicationKey> = new Set<MdcApplicationKey>();

  dockItems: MenuItem[] = dockMenuItems(this.openApplication.bind(this));

  menubarItems!: MenuItem[];

  responsiveOptions = responsiveOptions;

  images: any[] | undefined;

  nodes: any[] | undefined;

  subscription: Subscription | undefined;

  terminalDisabled = false;

  constructor(
    private rageClientService: RageClientService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private terminalService: TerminalService) {
    this.menubarItems = [
      ...menubarItems(this.openApplication.bind(this)),
      {
        label: 'quit',
        icon: 'pi pi-fw pi-times-circle',
        command: () => this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.MDC)
      }
    ];
  }

  commandHandler(text: string) {
    let response;
    const input = text.trim(); // npr "track 064123456"
    const parts = input.split(' ');

    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case 'date':
        response = 'Today is ' + new Date().toDateString();
        break;

      case 'help':
        response = 'Available commands: date, help, track';
        break;

      case 'track':
        this.trackPhoneNumber(args[0]);
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

    if (key === 'terminal') {
      this.terminalDisabled = false;
    }
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

  private trackPhoneNumber(phoneNumber: string) {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      this.terminalService.sendResponse('mdc[cmd]: track <phoneNumber>');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      this.terminalService.sendResponse(this.translateService.instant('invalid_phone_number'));
    }
    const loadingTime = Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000;

    this.terminalService.sendResponse(this.translateService.instant('mdc_tracking_phone_number', { phoneNumber }));

    this.terminalDisabled = true;
    of(phoneNumber).pipe(
      delay(loadingTime),
      switchMap(phone =>
        this.rageClientService.callServer<IVector3>(ProcedureKey.SERVER_TRACK_PHONE_NUMBER, phone)
      )
    ).subscribe({
      next: (position) => {
        this.terminalDisabled = false;
        console.log('Tracked position:', JSON.stringify(position));
        this.dialogService.open<TrackPhoneNumberComponent, TrackPhoneNumberData>(TrackPhoneNumberComponent, {
          header: this.translateService.instant('mdc_phone_number_tracking_result'),
          width: '35%',
          data: {
            phoneNumber,
            position
          }
        })
        this.terminalService.sendResponse(`Phone number ${phoneNumber} located at X: ${position.x}, Y: ${position.y}, Z: ${position.z}`);
      },
      error: (err: ApiError) => {
        this.terminalDisabled = false;
        this.terminalService.sendResponse(err.message);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
