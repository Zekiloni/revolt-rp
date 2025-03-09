import { Store } from '@ngrx/store';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { interval, map, Observable, startWith } from 'rxjs';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DockModule } from 'primeng/dock';
import { ButtonDirective } from 'primeng/button';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { gameUiConfig, IPhoneMessage, ProcedureKey } from '@revolt-rp/common';
import { fadeInOutTrigger, scaleInOutTrigger, slideInOutTrigger } from '../../../domain/util/animation.util';
import { PhoneState, selectPhone, setPhone, setPhoneMessages } from '../../../store/phone';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { StaticAssetPipe } from '../../../domain/pipe/static-asset.pipe';
import { getPhoneDockTooltip } from '../../../domain/util/phone.util';
import { CalculatorComponent } from './components/calculator';
import { MapComponent } from './components/map/map.component';
import { MessengerComponent } from './components/messenger';
import { SettingsComponent } from './components/settings';
import { CameraComponent } from './components/camera';
import { phoneApplications } from '../../../domain/config/phone.config';


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
  imports: [CommonModule, TranslatePipe, DockModule, StaticAssetPipe, ButtonDirective, NgOptimizedImage],
  templateUrl: './smartphone.component.html',
  styleUrl: './smartphone.component.css',
  animations: [
    slideInOutTrigger,
    scaleInOutTrigger,
    fadeInOutTrigger
  ]
})
export class SmartphoneComponent implements OnInit {
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

  constructor(private translateService: TranslateService,
              @Inject(Store) private store: Store<PhoneState>,
              private rageClientService: RageClientService) {
    this.registerApplications();
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

  private registerApplications() {
    this.applications = phoneApplications
      .map(app => {
        return {
          ...app,
          tooltipOptions: getPhoneDockTooltip(this.translateService.instant(app.name)),
          command: (event: MenuItemCommandEvent) => this.setApplicationOpened((<IApplication>event.item))
        };
      });
  }

  private listenToPhoneStateEvents() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PHONE, (phoneInfo: IPhoneItem) => {
      this.store.dispatch(setPhone({ phone: phoneInfo }));
    });

    this.rageClientService.on(ProcedureKey.BROWSER_SET_PHONE_MESSAGES, (messages: IPhoneMessage[]) => {
      this.store.dispatch(setPhoneMessages({ messages }));
    });
  }

  private setApplicationOpened(app: IApplication) {
    this.openedApplication = app;
  }

  openApp(event: Event, app: IApplication, index: number) {
    if (app.command)
      app.command({ originalEvent: event, item: app, index });
  }

  closeApp() {
    this.openedApplication = null;
  }

  ngOnInit(): void {
    this.listenToPhoneStateEvents();
    this.store.select(selectPhone).subscribe(phoneItem => {
      this.phoneItem = phoneItem as IPhoneItem;
    });
  }
}
