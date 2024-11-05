import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-split-item',
  standalone: true,
  imports: [CommonModule, InputNumberModule, FormsModule, Button],
  templateUrl: './split-item.component.html',
  styleUrl: './split-item.component.css'
})
export class SplitItemComponent {
  splitQuantity: number | null = null;

  constructor(private dialogRef: DynamicDialogRef) {
  }

  submitSplit() {
    this.dialogRef.close(this.splitQuantity);
  }
}
