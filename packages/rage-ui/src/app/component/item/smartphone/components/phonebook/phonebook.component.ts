import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPhoneContact } from '@revolt-rp/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonDirective } from 'primeng/button';
import { filterGlobal } from '../../../../../domain/util/table.util';
import { PhoneState, selectPhoneContacts } from '../../../../../store/phone';


@Component({
  selector: 'app-phonebook',
  standalone: true,
  imports: [CommonModule, TableModule, AvatarModule, InputTextModule, TranslatePipe, ButtonDirective, IconFieldModule, InputIconModule],
  templateUrl: './phonebook.component.html',
  styleUrl: './phonebook.component.css'
})
export class PhonebookComponent {
  protected readonly filterGlobal = filterGlobal;

  $contacts!: Observable<IPhoneContact[]>;
  selectedContact!: IPhoneContact | null;

  constructor(private store: Store<PhoneState>) {
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

  addContact() {
    //
  }
}
