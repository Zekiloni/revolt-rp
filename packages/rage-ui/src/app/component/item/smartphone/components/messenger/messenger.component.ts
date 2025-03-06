import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addPhoneMessage, PhoneState, selectPhone, selectPhoneMessages } from '../../../../../store/phone';
import { getConversations } from '../../../../../domain/util/phone.util';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { IPhoneContact, IPhoneMessage, PhoneMessageType } from '@revolt-rp/common';
import { Scroller, ScrollerModule } from 'primeng/scroller';
import { ChipsModule } from 'primeng/chips';
import { ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [CommonModule, ScrollerModule, ChipsModule, ButtonDirective, FormsModule, InputGroupAddonModule, InputGroupModule],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.css'
})
export class MessengerComponent implements OnInit {
  @ViewChild(Scroller) messagesScroller!: Scroller;

  conversations: string[] = [];
  messages: IPhoneMessage[] = [];
  contacts: IPhoneContact[] = [];

  phoneNumber: string | null = null;
  selectedConversation: string | null = null;

  messageContent = '';

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

  isMessageSent(message: IPhoneMessage) {
    return message.sender === this.phoneNumber;
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

        this.scrollToBottom();
      }
    });
  }

  sendMessage(recipient: string, messageContent: string) {
    if (!this.messageContent.length)
      return;

    const message: IPhoneMessage = {
      type: PhoneMessageType.Text,
      sender: this.phoneNumber as string,
      receiver: recipient,
      content: messageContent,
      seen: false,
      createdAt: new Date()
    };

    this.store.dispatch(addPhoneMessage({ message }));
    this.messageContent = '';

    // this.store.select(selectPhoneMessages).subscribe(messages => {
    //   console.log(messages);
    // });
  }

  scrollToBottom(): void {
    console.log(this.messagesScroller);
    if (this.selectedConversation) {
      const scroller = this.messagesScroller;
      const conversationMessages = this.getConversationMessages(this.selectedConversation);
      console.log(conversationMessages.length);
      scroller.scrollToIndex(conversationMessages.length - 1);
    }
  }
}
