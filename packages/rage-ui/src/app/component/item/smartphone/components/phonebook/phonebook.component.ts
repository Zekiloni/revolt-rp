import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { IPhoneContact, ProcedureKey } from '@revolt-rp/common';
import { NewContactComponent } from './components/new-contact';
import { filterGlobal } from '../../../../../domain/util/table.util';
import { addPhoneContact, PhoneState, selectPhone, selectPhoneContacts } from '../../../../../store/phone';
import { RageClientService } from '../../../../../domain/service/rage-client.service';


@Component({
  selector: 'app-phonebook',
  standalone: true,
  imports: [CommonModule, TableModule, AvatarModule, InputTextModule, TranslatePipe, ButtonDirective, IconFieldModule, InputIconModule, NewContactComponent],
  templateUrl: './phonebook.component.html',
  styleUrl: './phonebook.component.css'
})
export class PhonebookComponent {
  protected readonly filterGlobal = filterGlobal;

  $contacts!: Observable<IPhoneContact[]>;
  selectedContact!: IPhoneContact | null;

  addingNewContact = false;

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

  addContact(contact: IPhoneContact) {
    this.addingNewContact = false;
    this.store.select(selectPhone)
      .pipe(map(phone => phone?.id))
      .subscribe(phoneId => {
        this.rageClientService.callServer<IPhoneContact>(ProcedureKey.SERVER_CREATE_PHONE_CONTACT, {
          ...contact,
          phoneId
        }).subscribe({ next: this.handleContactCreated });
      });
  }
}
