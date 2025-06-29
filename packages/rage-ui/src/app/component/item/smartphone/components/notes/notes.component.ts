import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonDirective } from 'primeng/button';
import { ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { PhoneState, setPhone } from '../../../../../store/phone';
import { TextareaModule } from 'primeng/textarea';


@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, ButtonDirective, TranslatePipe, TextareaModule, FormsModule, PanelModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent implements OnInit {
  @Input() phoneItem!: IPhoneItem;

  notes: string[] = [];

  unsavedChanges = false;

  constructor(private rageClientService: RageClientService, private store: Store<PhoneState>) {
  }

  get isAddNoteDisabled(): boolean {
    return this.notes.length >= 10;
  }

  getNotesTitle(note: string): string {
    const words = note.split(' ').slice(0, 3).join(' ');
    return words.length > 20 ? words.slice(0, 20) : words || 'no_title';
  }

  addNote() {
    this.unsavedChanges = true;
    this.notes.unshift('');
  }

  removeNote(index: number) {
    this.unsavedChanges = true;
    this.notes.splice(index, 1);
  }

  private handleNotesUpdate = (notes: string[]) => {
    this.unsavedChanges = false;
    this.store.dispatch(setPhone({ phone: { ...this.phoneItem, phoneInfo: { ...this.phoneItem.phoneInfo, notes } } }));
  };

  save() {
    this.rageClientService.callServer<string[]>(ProcedureKey.SERVER_PHONE_UPDATE_NOTES, this.notes)
      .subscribe({ next: this.handleNotesUpdate });
  }

  cancel() {
    this.notes = [...this.phoneItem.phoneInfo.notes];
    this.unsavedChanges = false;
  }

  ngOnInit() {
    this.notes = [...this.phoneItem.phoneInfo.notes];
  }
}
