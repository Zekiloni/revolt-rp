import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { IPhoneCall, IPhoneContact, PhoneCallStatus } from '@revolt-rp/common';
import { PhoneState, selectPhone, setPhoneCall } from '../../../../../../../store/phone';


@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [CommonModule, ButtonDirective, InputTextModule, PaginatorModule, ReactiveFormsModule, TranslatePipe, ToggleButtonModule],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.css'
})
export class SingleContactComponent implements OnInit {
  @Input() contact!: IPhoneContact;
  @Output() deleteContact = new EventEmitter<IPhoneContact>();
  @Output() editContact = new EventEmitter<IPhoneContact>();

  contactUpdate!: IPhoneContact;

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

  delete() {
    this.deleteContact.emit(this.contact);
  }

  ngOnInit(): void {
    this.contactUpdate = { ...this.contact };
  }
}
