import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneState, selectPhone, selectPhoneMessages } from '../../../../../store/phone';
import { getConversations } from '../../../../../domain/util/phone.util';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { IPhoneContact, IPhoneMessage } from '@revolt-rp/common';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.css'
})
export class MessengerComponent implements OnInit {
  conversations: string[] = [];
  messages: IPhoneMessage[] = [];
  contacts: IPhoneContact[] = [];

  selectedConversation: string | null = null;

  constructor(private store: Store<PhoneState>) {
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
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.content || '';
  }

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectPhone).pipe(map(phone => {
        this.contacts = phone?.phoneInfo?.contacts || [];
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
