import { Store } from '@ngrx/store';
import { interval, map, Observable, startWith } from 'rxjs';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DockModule } from 'primeng/dock';
import { BadgeModule } from 'primeng/badge';
import { ButtonDirective } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MenuItem, MenuItemCommandEvent, Message } from 'primeng/api';
import { gameUiConfig, IPhoneCall, IPhoneMessage, ProcedureKey } from '@revolt-rp/common';
import {
  fadeInOutTrigger,
  scaleInOutTrigger,
  slideDownUpTrigger,
  slideInOutTrigger
} from '../../../domain/util/animation.util';
import {
  addPhoneMessage,
  PhoneState,
  selectPhoneItem,
  selectPhoneCall, selectPhoneMessages,
  setPhone,
  setPhoneMessages
} from '../../../store/phone';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { StaticAssetPipe } from '../../../domain/pipe/static-asset.pipe';
import { getPhoneDockTooltip } from '../../../domain/util/phone.util';
import { phoneApplications } from '../../../domain/config/phone.config';
import { PhoneCallComponent } from './components/phone-call';


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
  imports: [CommonModule, TranslatePipe, DockModule, StaticAssetPipe, ButtonDirective, NgOptimizedImage, PhoneCallComponent, MessagesModule, BadgeModule],
  templateUrl: './smartphone.component.html',
  styleUrl: './smartphone.component.css',
  animations: [
    slideInOutTrigger,
    scaleInOutTrigger,
    slideDownUpTrigger,
    fadeInOutTrigger
  ]
})
export class SmartphoneComponent implements OnInit {
  @Input() isActive = gameUiConfig.smartphone.isActive;

  phoneItem!: IPhoneItem;
  notifications: Message[] = [];

  $time: Observable<Date> = interval(1000).pipe(
    startWith(0),
    map(() => {
      return new Date();
    })
  );

  applications!: IApplication[];
  openedApplication: IApplication | null = null;

  $phoneCall!: Observable<IPhoneCall | null>;

  constructor(private translateService: TranslateService,
              @Inject(Store) private store: Store<PhoneState>,
              private rageClientService: RageClientService) {
    this.subscribeToPhoneCall();
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

  notify(message: Message) {
    if (this.notifications.length >= 2) {
      this.notifications.shift();
    }
    this.notifications.push(message);
  }

  private newMessage(message: IPhoneMessage) {
    this.store.dispatch(addPhoneMessage({ message }));
    if (message.receiver === this.phoneItem.phoneInfo.phoneNumber) {
      this.notify({
        severity: 'info',
        detail: `${message.sender}: ${message.content}`,
        life: 5000,
        closable: true
      });
    }
  }

  private listenToPhoneStateEvents() {
    this.rageClientService.on(ProcedureKey.BROWSER_SET_PHONE, (phoneInfo: IPhoneItem) => {
      this.store.dispatch(setPhone({ phone: phoneInfo }));
    });

    this.rageClientService.on(ProcedureKey.BROWSER_SET_PHONE_MESSAGES, (messages: IPhoneMessage[]) => {
      this.store.dispatch(setPhoneMessages({ messages }));
      this.getUnreadMessages();
    });

    this.rageClientService.on(ProcedureKey.BROWSER_ADD_PHONE_MESSAGE, (message: IPhoneMessage) => {
      this.newMessage(message);
    });
  }

  private setApplicationOpened(app: IApplication) {
    this.openedApplication = app;
  }

  private subscribeToPhoneCall() {
    this.$phoneCall = this.store.select(selectPhoneCall);
  }

  openApp(event: Event, app: IApplication, index: number) {
    if (app.command)
      app.command({ originalEvent: event, item: app, index });
  }

  closeApp() {
    this.openedApplication = null;
  }

  private getUnreadMessages() {
    this.store.select(selectPhoneMessages).subscribe(messages => {
      const length = messages.filter(msg => !msg.seen && msg.sender === this.phoneItem.phoneInfo.phoneNumber).length;
      this.applications.find(app => app.key === 'messages')!.badge = length.toString();
    });
  }

  ngOnInit(): void {
    this.listenToPhoneStateEvents();
    this.store.select(selectPhoneItem).subscribe(phoneItem => {
      this.phoneItem = phoneItem as IPhoneItem;
    });
  }
}
