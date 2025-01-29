import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-bank-menu',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './bank-menu.component.html',
  styleUrl: './bank-menu.component.css',
})
export class BankMenuComponent {}
