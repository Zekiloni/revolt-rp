import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonDirective } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PhoneState } from '../../../../../store/phone';


@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, ButtonDirective, TranslatePipe, InputTextareaModule, FormsModule, PanelModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent implements OnInit {
  @Input() phoneItem!: IPhoneItem;

  notes: string[] = [];

  constructor(private store: Store<PhoneState>) {
  }

  get isAddNoteDisabled(): boolean {
    return this.notes.length >= 10;
  }

  getNotesTitle(note: string): string {
    const words = note.split(' ').slice(0, 3).join(' ');
    return words.length > 20 ? words.slice(0, 20) : words || 'no_title';
  }

  addNote() {
    this.notes.push('');
  }

  ngOnInit() {
    this.notes = [...this.phoneItem.phoneInfo.notes];
  }
}
