import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { IPhoneContact } from '@revolt-rp/common';


@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [CommonModule, ButtonDirective, InputTextModule, PaginatorModule, ReactiveFormsModule, TranslatePipe, ToggleButtonModule],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.css'
})
export class SingleContactComponent implements OnInit {
  @Input() phoneItem!: IPhoneItem;
  @Input() contact!: IPhoneContact;

  @Output() deleteContact = new EventEmitter<IPhoneContact>();
  @Output() editContact = new EventEmitter<IPhoneContact>();
  @Output() callContact = new EventEmitter<IPhoneContact>();

  contactUpdate!: IPhoneContact;

  async copyPhoneNumber(phoneNumber: string) {
    await navigator.clipboard.writeText(phoneNumber);
  }

  call() {
    this.callContact.emit(this.contact);
  }

  delete() {
    this.deleteContact.emit(this.contact);
  }

  ngOnInit(): void {
    this.contactUpdate = { ...this.contact };
  }
}
