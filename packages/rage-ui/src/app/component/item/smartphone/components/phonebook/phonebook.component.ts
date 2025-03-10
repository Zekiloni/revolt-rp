import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { IPhoneContact, IPhoneContactCreate, ProcedureKey } from '@revolt-rp/common';
import { NewContactComponent } from './components/new-contact';
import { filterGlobal } from '../../../../../domain/util/table.util';
import {
  addPhoneContact,
  deletePhoneContact,
  PhoneState,
  selectPhone,
  selectPhoneContacts, updatePhoneContact
} from '../../../../../store/phone';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { SingleContactComponent } from './components/single-contact';



@Component({
  selector: 'app-phonebook',
  standalone: true,
  imports: [CommonModule, TableModule, AvatarModule, InputTextModule, TranslatePipe, ButtonDirective, IconFieldModule, InputIconModule, NewContactComponent, SingleContactComponent],
  templateUrl: './phonebook.component.html',
  styleUrl: './phonebook.component.css'
})
export class PhonebookComponent implements OnInit {
  protected readonly filterGlobal = filterGlobal;

  $contacts!: Observable<IPhoneContact[]>;
  selectedContact!: IPhoneContact | null;

  addingNewContact = false;

  phoneItemId!: string;

  constructor(private store: Store<PhoneState>, private rageClientService: RageClientService) {
    this.loadContacts();
  }

  private loadContacts() {
    this.$contacts = this.store.select(selectPhoneContacts)
      .pipe(map(contacts => this.sortContacts(contacts)));
  }

  private sortContacts(contacts: IPhoneContact[]): IPhoneContact[] {
    return [...contacts]
      .sort((a, b) => {
        if (a.favorite === b.favorite) {
          return a.name.localeCompare(b.name);
        }
        return a.favorite ? -1 : 1;
      });
  }

  private handleContactCreated = (contact: IPhoneContact) => {
    this.selectedContact = contact;
    this.store.dispatch(addPhoneContact({ contact }));
  };

  private handleContactDeleted = (contactId: string) => {
    this.selectedContact = null;
    this.store.dispatch(deletePhoneContact({ contactId }));
  };

  private handleContactUpdated = (contact: IPhoneContact) => {
    this.store.dispatch(updatePhoneContact({ contact }));
  };

  addContact(contactCreate: IPhoneContactCreate) {
    this.addingNewContact = false;
    contactCreate.phoneItemId = this.phoneItemId;
    this.rageClientService.callServer<IPhoneContact>(ProcedureKey.SERVER_CREATE_PHONE_CONTACT, contactCreate)
      .subscribe({ next: this.handleContactCreated });
  }

  deleteContact(contact: IPhoneContact) {
    this.rageClientService.callServer<string>(ProcedureKey.SERVER_DELETE_PHONE_CONTACT, contact)
      .subscribe({ next: this.handleContactDeleted })
  }

  updateContact(contact: IPhoneContact) {
    this.rageClientService.callServer<IPhoneContact>(ProcedureKey.SERVER_UPDATE_PHONE_CONTACT, contact)
      .subscribe({ next: this.handleContactUpdated })
  }

  ngOnInit(): void {
    this.store.select(selectPhone)
      .pipe(map(phone => phone?.id))
      .subscribe(phoneItemId => this.phoneItemId = phoneItemId!);
  }
}
