import * as L from 'leaflet';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChipsModule } from 'primeng/chips';
import { ButtonDirective } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { Scroller, ScrollerModule } from 'primeng/scroller';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IPhoneContact, IPhoneMessage, IPhoneMessageCreate, PhoneMessageType } from '@revolt-rp/common';
import { PhoneState, selectPhone, selectPhoneMessages } from '../../../../../store/phone';
import { WorldMapComponent } from '../../../../misc/world-map/world-map.component';
import { getConversations } from '../../../../../domain/util/phone.util';
import { dayjs } from '../../../../../domain/util/dajys.util';
import { DialogModule } from 'primeng/dialog';
import { ComposeMessageComponent } from '../compose-message';
import { BadgeModule } from 'primeng/badge';
import { StaticAssetPipe } from '../../../../../domain/pipe/static-asset.pipe';


@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [
    CommonModule,
    ScrollerModule,
    ChipsModule,
    ButtonDirective,
    FormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    WorldMapComponent,
    TranslatePipe, DialogModule,
    ComposeMessageComponent,
    BadgeModule,
  ],
  providers: [StaticAssetPipe],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.css'
})
export class MessengerComponent implements OnInit {
  protected readonly PhoneMessageType = PhoneMessageType;

  @ViewChild('messagesScroller') messagesScroller!: Scroller;

  conversations: string[] = [];
  messages: IPhoneMessage[] = [];

  maps: Map<string, L.Map> = new Map();
  markerIcon!: L.Icon;

  contacts: IPhoneContact[] = [];
  phoneNumber: string | null = null;

  selectedConversation: string | null = null;
  messageContent = '';

  searchConversation = '';
  composeNewMessage = false;

  constructor(private store: Store<PhoneState>, private staticAssetPipe: StaticAssetPipe) {
    this.markerIcon = L.icon({
      iconUrl: this.staticAssetPipe.transform('assets/images/blips/1.png'),
      iconSize: [16, 16],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  get filteredConversations() {
    if (this.searchConversation.length) {
      return this.conversations.filter(c => this.getContactName(c).toLowerCase().includes(this.searchConversation.toLowerCase()));
    } else {
      return this.conversations;
    }
  }

  getConversationMessages(phoneNumber: string) {
    return this.messages.filter(msg => msg.sender === phoneNumber || msg.receiver === phoneNumber);
  }

  getContactName(phoneNumber: string) {
    const contact = this.contacts.find(c => c.phoneNumber === phoneNumber);
    return contact ? contact.name : phoneNumber;
  }

  getLastMessage(phoneNumber: string) {
    const messages = this.getConversationMessages(phoneNumber);
    return messages[messages.length - 1];
  }

  isMessageSent(message: IPhoneMessage) {
    return message.sender === this.phoneNumber;
  }

  sendMessage(recipient: string, messageContent: string) {
    if (!this.messageContent.length)
      return;

    const message: IPhoneMessageCreate = {
      type: PhoneMessageType.Text,
      sender: this.phoneNumber as string,
      receiver: recipient,
      content: messageContent
    };

    // this.store.dispatch(addPhoneMessage({ message }));
    this.messageContent = '';

    // this.store.select(selectPhoneMessages).subscribe(messages => {
    //   console.log(messages);
    // });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.selectedConversation) {
        const scroller = this.messagesScroller;
        if (scroller) {
          const element = scroller.elementViewChild?.nativeElement;
          element.scrollTop = element.scrollHeight;
        }
      }
    }, 500);
  }

  fromNow(date: Date) {
    return dayjs(date).fromNow(false);
  }

  getUnreadMessages(conversation: string) {
    return this.getConversationMessages(conversation).filter(msg => !msg.seen && msg.sender === conversation).length;
  }

  navigateMeTo(message: IPhoneMessage) {
    //
  }

  selectConversation(conversation: string) {
    this.selectedConversation = conversation;
    this.scrollToBottom()
  }

  mapOnInit(map: L.Map, message: IPhoneMessage) {
    this.maps.set(message.id, map);
    const coords = JSON.parse(message.content) as { lat: number, lng: number };
    console.log(coords);
    map.setView([coords.lat, coords.lng], 16);
    L.marker([coords.lat, coords.lng], { icon: this.markerIcon }).addTo(map);
  }

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectPhone).pipe(map(phone => {
        this.contacts = phone?.phoneInfo?.contacts || [];
        this.phoneNumber = phone?.phoneInfo?.phoneNumber as string;
        return phone?.phoneInfo?.phoneNumber;
      })),
      this.store.select(selectPhoneMessages)
    ]).subscribe(([phoneNumber, messages]) => {
      if (phoneNumber) {
        this.messages = messages;
        this.conversations = getConversations(phoneNumber, messages);
      }
    });
  }
}
