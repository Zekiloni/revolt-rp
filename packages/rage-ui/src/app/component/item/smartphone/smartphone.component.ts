import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gameUiConfig } from '@revolt-rp/common';
import { fadeInOutTrigger, scaleInOutTrigger, slideInOutTrigger } from '../../../domain/util/animation.util';
import { CalculatorComponent } from './components/calculator';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DockModule } from 'primeng/dock';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { MapComponent } from './components/map/map.component';
import { StaticAssetPipe } from '../../../domain/pipe/static-asset.pipe';
import { ButtonDirective } from 'primeng/button';
import { interval, map, Observable, startWith } from 'rxjs';
import { MessengerComponent } from './components/messenger';
import { getPhoneDockTooltip } from '../../../domain/util/phone.util';
import { SettingsComponent } from './components/settings';
import { Store } from '@ngrx/store';
import { PhoneState } from '../../../store/phone/phone.reducer';
import { selectPhone } from '../../../store/phone/phone.selectors';


export interface IApplication extends MenuItem {
  key: string;
  name: string;
  icon: string;
  pinned?: boolean;
  component: any;
}


@Component({
  selector: 'app-smartphone',
  standalone: true,
  imports: [CommonModule, TranslatePipe, DockModule, StaticAssetPipe, ButtonDirective],
  templateUrl: './smartphone.component.html',
  styleUrl: './smartphone.component.css',
  animations: [
    slideInOutTrigger,
    scaleInOutTrigger,
    fadeInOutTrigger
  ]
})
export class SmartphoneComponent implements OnInit{
  @Input() isActive = gameUiConfig.smartphone.isActive;

  phoneItem!: IPhoneItem;

  $time: Observable<Date> = interval(1000).pipe(
    startWith(0),
    map(() => {
      return new Date();
    })
  );

  applications!: IApplication[];

  openedApplication: IApplication | null = null;

  constructor(private translateService: TranslateService, @Inject(Store) private store: Store<PhoneState>) {
    this.registerApps();
  }

  get opacity() {
    return this.phoneItem.phoneInfo?.opacity || 1;
  }

  get background() {
    return this.phoneItem.phoneInfo?.backgroundImage || 'assets/images/phone/backgrounds/1.jpg';
  }

  get pinnedApps() {
    return this.applications.filter(app => app.pinned);
  }

  get otherApps() {
    return this.applications.filter(app => !app.pinned);
  }

  private setApplicationOpened(app: IApplication) {
    this.openedApplication = app;
  }

  openApp(event: Event, app: IApplication, index: number) {
    if (app.command)
      app.command({ originalEvent: event, item: app, index });
  }

  private registerApps() {
    this.applications = [
      {
        key: 'contacts',
        name: 'contacts',
        icon: 'assets/images/phone/icons/contacts.svg',
        tooltipOptions: getPhoneDockTooltip(this.translateService.instant('contacts')),
        pinned: true,
        component: CalculatorComponent,
        command: (event: MenuItemCommandEvent) => this.setApplicationOpened(event.item as IApplication)
      },
      {
        key: 'calls',
        name: 'calls',
        icon: 'assets/images/phone/icons/calls.svg',
        tooltipOptions: getPhoneDockTooltip(this.translateService.instant('calls')),
        pinned: true,
        component: CalculatorComponent,
        command: (event: MenuItemCommandEvent) => this.setApplicationOpened(event.item as IApplication)
      }, {
        key: 'messages',
        name: 'messages',
        icon: 'assets/images/phone/icons/messages.svg',
        pinned: true,
        tooltipOptions: getPhoneDockTooltip(this.translateService.instant('messenger')),
        component: MessengerComponent,
        command: (event: MenuItemCommandEvent) => this.setApplicationOpened(event.item as IApplication)
      },
      {
        key: 'calculator',
        name: 'calculator',
        icon: 'assets/images/phone/icons/calculator.svg',
        component: CalculatorComponent,
        command: (event: MenuItemCommandEvent) => this.setApplicationOpened(event.item as IApplication)
      },
      {
        key: 'settings',
        name: 'settings',
        icon: 'assets/images/phone/icons/settings.svg',
        component: SettingsComponent,
        command: (event: MenuItemCommandEvent) => this.setApplicationOpened(event.item as IApplication)
      },
      {
        key: 'camera',
        name: 'camera',
        icon: 'assets/images/phone/icons/camera.svg',
        component: CalculatorComponent,
        command: (event: MenuItemCommandEvent) => this.setApplicationOpened(event.item as IApplication)
      },
      {
        key: 'notes',
        name: 'notes',
        icon: 'assets/images/phone/icons/notes.svg',
        component: CalculatorComponent,
        command: (event: MenuItemCommandEvent) => this.setApplicationOpened(event.item as IApplication)
      },
      {
        key: 'map',
        name: 'map',
        icon: 'assets/images/phone/icons/maps.svg',
        component: MapComponent,
        command: (event: MenuItemCommandEvent) => this.setApplicationOpened(event.item as IApplication)
      }
    ];
  }

  closeApp() {
    this.openedApplication = null;
  }

  ngOnInit(): void {
    this.store.select(selectPhone).subscribe(phoneItem => {
      this.phoneItem = phoneItem as IPhoneItem;
    });
  }
}
