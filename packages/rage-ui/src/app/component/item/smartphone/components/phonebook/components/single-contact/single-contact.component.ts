import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPhoneCall, IPhoneContact, PhoneCallStatus } from '@revolt-rp/common';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Store } from '@ngrx/store';
import { PhoneState, selectPhone, setPhoneCall } from '../../../../../../../store/phone';
import { map } from 'rxjs';

@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [CommonModule, ButtonDirective, InputTextModule, PaginatorModule, ReactiveFormsModule, TranslatePipe, ToggleButtonModule],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.css'
})
export class SingleContactComponent {
  @Input() contact!: IPhoneContact;

  constructor(private store: Store<PhoneState>) {
  }

  async copyPhoneNumber(phoneNumber: string) {
    await navigator.clipboard.writeText(phoneNumber);
  }

  call() {
    this.store.select(selectPhone)
      .pipe(map(phone => phone?.phoneInfo.phoneNumber))
      .subscribe(phoneNumber => {
        const currentCall: IPhoneCall = {
          caller: phoneNumber!,
          receiver: this.contact.phoneNumber,
          createdAt: new Date,
          status: PhoneCallStatus.Dialing
        };
        this.store.dispatch(setPhoneCall({ currentCall }));
      });
  }
}
