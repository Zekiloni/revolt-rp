import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IPhoneContact, IPhoneContactCreate, ProcedureKey } from '@revolt-rp/common';
import { NewContactComponent } from './components/new-contact';
import { filterGlobal } from '../../../../../domain/util/table.util';
import {
  addPhoneContact,
  deletePhoneContact,
  PhoneState,
  updatePhoneContact
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
export class PhonebookComponent {
  protected readonly filterGlobal = filterGlobal;

  @Input() phoneItem!: IPhoneItem;

  selectedContact!: IPhoneContact | null;

  addingNewContact = false;

  phoneItemId!: string;

  constructor(private store: Store<PhoneState>, private rageClientService: RageClientService) {
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

  sortContacts(contacts: IPhoneContact[]): IPhoneContact[] {
    return [...contacts]
      .sort((a, b) => {
        if (a.favorite === b.favorite) {
          return a.name.localeCompare(b.name);
        }
        return a.favorite ? -1 : 1;
      });
  }

  addContact(contactCreate: IPhoneContactCreate) {
    this.addingNewContact = false;
    contactCreate.phoneItemId = this.phoneItemId;
    this.rageClientService.callServer<IPhoneContact>(ProcedureKey.SERVER_CREATE_PHONE_CONTACT, contactCreate)
      .subscribe({ next: this.handleContactCreated });
  }

  deleteContact(contact: IPhoneContact) {
    this.rageClientService.callServer<string>(ProcedureKey.SERVER_DELETE_PHONE_CONTACT, contact)
      .subscribe({ next: this.handleContactDeleted });
  }

  updateContact(contact: IPhoneContact) {
    this.rageClientService.callServer<IPhoneContact>(ProcedureKey.SERVER_UPDATE_PHONE_CONTACT, contact)
      .subscribe({ next: this.handleContactUpdated });
  }

  createCall(contact: IPhoneContact) {
    this.rageClientService.triggerServer(ProcedureKey.SERVER_CREATE_PHONE_CALL, contact.phoneNumber);
  }
}
