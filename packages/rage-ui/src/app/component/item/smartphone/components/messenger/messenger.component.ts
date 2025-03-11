import * as L from 'leaflet';
import { Store } from '@ngrx/store';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChipsModule } from 'primeng/chips';
import { ButtonDirective } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { Scroller, ScrollerModule } from 'primeng/scroller';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IPhoneContact, IPhoneMessage, IPhoneMessageCreate, PhoneMessageType, ProcedureKey } from '@revolt-rp/common';
import {
  PhoneState,
  selectPhoneMessages, updateManyPhoneMessages
} from '../../../../../store/phone';
import { WorldMapComponent } from '../../../../misc/world-map/world-map.component';
import { getConversations } from '../../../../../domain/util/phone.util';
import { dayjs } from '../../../../../domain/util/dajys.util';
import { DialogModule } from 'primeng/dialog';
import { ComposeMessageComponent } from '../compose-message';
import { BadgeModule } from 'primeng/badge';
import { StaticAssetPipe } from '../../../../../domain/pipe/static-asset.pipe';
import { RageClientService } from '../../../../../domain/service/rage-client.service';


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
    BadgeModule
  ],
  providers: [StaticAssetPipe],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.css'
})
export class MessengerComponent implements OnInit {
  protected readonly PhoneMessageType = PhoneMessageType;

  @Input() phoneItem!: IPhoneItem;

  @ViewChild('messagesScroller') messagesScroller!: Scroller;

  conversations: string[] = [];
  messages: IPhoneMessage[] = [];

  maps: Map<string, L.Map> = new Map();
  markerIcon!: L.Icon;

  contacts: IPhoneContact[] = [];

  _selectedConversation = new BehaviorSubject<string | null>(null);
  messageContent = '';

  searchConversation = '';
  isComposeActive = false;

  constructor(private store: Store<PhoneState>, private staticAssetPipe: StaticAssetPipe, private rageClientService: RageClientService) {
    this.markerIcon = L.icon({
      iconUrl: this.staticAssetPipe.transform('assets/images/blips/1.png'),
      iconSize: [16, 16],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  get selectedConversation() {
    return this._selectedConversation.value;
  }

  set selectedConversation(value: string | null) {
    this._selectedConversation.next(value);
  }

  get filteredConversations() {
    const filtered = this.searchConversation.length
      ? this.conversations.filter(c =>
        this.getContactName(c).toLowerCase().includes(this.searchConversation.toLowerCase())
      )
      : this.conversations;

    return [...filtered].sort(this.sortConversations);
  }

  sortConversations = (a: string, b: string) => {
    const lastMessageA = this.getLastMessage(a);
    const lastMessageB = this.getLastMessage(b);

    if (!lastMessageA || !lastMessageB)
      return 0;

    return new Date(lastMessageB.createdAt).getTime() - new Date(lastMessageA.createdAt).getTime();
  };

  getConversationMessages(phoneNumber: string) {
    return this.messages.filter(msg => msg.sender === phoneNumber || msg.receiver === phoneNumber);
  }

  getContactName(phoneNumber: string) {
    const contact = this.contacts.find(c => c.phoneNumber === phoneNumber);
    return contact ? contact.name : phoneNumber;
  }

  getLastMessage(phoneNumber: string) {
    const messages = this.getConversationMessages(phoneNumber);
    const sortedMessages = messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sortedMessages[0];
  }

  isMessageSent(message: IPhoneMessage) {
    return message.sender === this.phoneItem.phoneInfo.phoneNumber;
  }

  listenToConversationScroll(): void {
    this._selectedConversation.pipe(debounceTime((50)))
      .subscribe((conversation) => {
        if (conversation) {
          const scroller = this.messagesScroller;
          if (scroller) {
            const element = scroller.elementViewChild?.nativeElement;
            element.scrollTop = element.scrollHeight;
          }
        }
      });
  }

  fromNow(date: Date) {
    return dayjs(date).fromNow(false);
  }

  getUnreadMessages(conversation: string) {
    return this.getConversationMessages(conversation).filter(msg => !msg.seen && msg.sender === conversation);
  }

  navigateMeTo(message: IPhoneMessage) {
    this.rageClientService.callServer<IPhoneMessage>(ProcedureKey.SERVER_UPDATE_PHONE_MESSAGE, message);
  }

  private updateMessagesAsSeen(conversation: string) {
    const unseenMessages = this.getUnreadMessages(conversation)
      .map(message => ({ ...message, seen: true }));

    if (unseenMessages.length) {
      this.rageClientService.callServer<IPhoneMessage[]>(ProcedureKey.SERVER_UPDATE_PHONE_MESSAGES, unseenMessages)
        .subscribe({
          next: (messages) => this.store.dispatch(updateManyPhoneMessages({ messages })),
          error: (error) => console.error(JSON.stringify(error))
        });
    }
  }

  selectConversation(conversation: string) {
    this.selectedConversation = conversation;
    this.updateMessagesAsSeen(conversation);
  }

  sendMessage(recipient: string, messageContent: string) {
    if (!messageContent.length)
      return;

    if (this.isComposeActive)
      this.isComposeActive = false;

    if (this.messageContent.length)
      this.messageContent = '';

    const messageCreate: IPhoneMessageCreate = {
      type: PhoneMessageType.Text,
      sender: this.phoneItem.phoneInfo.phoneNumber,
      receiver: recipient,
      content: messageContent
    };

    this.rageClientService.triggerServer(ProcedureKey.SERVER_SEND_PHONE_MESSAGE, messageCreate);
  }

  newConversation(event: IPhoneMessageCreate) {
    this.sendMessage(event.receiver, event.content);
  }

  mapOnInit(map: L.Map, message: IPhoneMessage) {
    this.maps.set(message.id, map);
    const coords = JSON.parse(message.content) as { lat: number, lng: number };
    map.setView([coords.lat, coords.lng], 16);
    L.marker([coords.lat, coords.lng], { icon: this.markerIcon }).addTo(map);
  }

  ngOnInit(): void {
    this.store.select(selectPhoneMessages).subscribe(messages => {
      this.messages = messages;
      this.conversations = getConversations(this.phoneItem.phoneInfo.phoneNumber, messages);
      this.listenToConversationScroll();
    });
  }
}
