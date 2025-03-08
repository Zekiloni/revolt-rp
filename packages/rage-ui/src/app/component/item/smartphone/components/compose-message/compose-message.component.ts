import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { IPhoneMessageCreate } from '@revolt-rp/common';
import { Store } from '@ngrx/store';
import { PhoneState, selectPhone } from '../../../../../store/phone';

@Component({
  selector: 'app-compose-message',
  standalone: true,
  imports: [CommonModule, ButtonDirective, TranslatePipe],
  templateUrl: './compose-message.component.html',
  styleUrl: './compose-message.component.css'
})
export class ComposeMessageComponent {
  @Output() cancelComposeMessage = new EventEmitter<void>();
  @Output() submitComposeMessage = new EventEmitter<IPhoneMessageCreate>();

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
}
