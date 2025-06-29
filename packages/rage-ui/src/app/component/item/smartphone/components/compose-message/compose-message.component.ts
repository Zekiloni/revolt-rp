import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { IPhoneContact, IPhoneMessageCreate, PhoneMessageType } from '@revolt-rp/common';
import { PhoneState } from '../../../../../store/phone';
import { Textarea } from 'primeng/textarea';


@Component({
  selector: 'app-compose-message',
  standalone: true,
  imports: [CommonModule, ButtonDirective, TranslatePipe, AutoCompleteModule, FormsModule, Textarea],
  templateUrl: './compose-message.component.html',
  styleUrl: './compose-message.component.css'
})
export class ComposeMessageComponent {
  @Input() phoneItem!: IPhoneItem;

  @Output() cancelComposeMessage = new EventEmitter<void>();
  @Output() submitComposeMessage = new EventEmitter<IPhoneMessageCreate>();

  recipient = '';
  filteredContacts: IPhoneContact[] = [];
  messageContent = '';

  constructor(private store: Store<PhoneState>) {
  }

  cancel() {
    this.cancelComposeMessage.emit();
  }

  searchContacts(event: AutoCompleteCompleteEvent) {
    this.filteredContacts = this.phoneItem.phoneInfo.contacts.filter(contact =>
      contact.name.toLowerCase().includes(event.query.toLowerCase()) || contact.phoneNumber.includes(event.query));
  }

  submitComposedMessage() {
    if (isNaN(Number(this.recipient))) {
      return;
    }

    this.submitComposeMessage.emit({
      type: PhoneMessageType.Text,
      sender: this.phoneItem.phoneInfo.phoneNumber,
      content: this.messageContent,
      receiver: this.recipient
    });
  }
}
