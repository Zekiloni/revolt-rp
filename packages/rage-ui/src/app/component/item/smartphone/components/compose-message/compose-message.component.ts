import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { IPhoneContact, IPhoneMessageCreate, PhoneMessageType } from '@revolt-rp/common';
import { PhoneState, selectPhone } from '../../../../../store/phone';


@Component({
  selector: 'app-compose-message',
  standalone: true,
  imports: [CommonModule, ButtonDirective, TranslatePipe, AutoCompleteModule, FormsModule, InputTextareaModule],
  templateUrl: './compose-message.component.html',
  styleUrl: './compose-message.component.css'
})
export class ComposeMessageComponent {
  @Input() contacts!: IPhoneContact[];

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

  submit() {
    this.store.select(selectPhone).subscribe(phone => {
      console.log(phone);
    });
  }

  searchContacts(event: AutoCompleteCompleteEvent) {
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(event.query.toLowerCase()) || contact.phoneNumber.includes(event.query));
  }

  submitComposedMessage() {
    if (isNaN(Number(this.recipient))) {
      return;
    }

    this.store.select(selectPhone)
      .subscribe(phone => {
        if (phone && phone.phoneInfo.phoneNumber) {
          this.submitComposeMessage.emit({
            type: PhoneMessageType.Text,
            sender: phone.phoneInfo.phoneNumber,
            content: this.messageContent,
            receiver: this.recipient
          });
        }
      });
  }
}
