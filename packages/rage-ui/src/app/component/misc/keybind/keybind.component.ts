import { Component, Input } from '@angular/core';
import { Chip } from 'primeng/chip';

@Component({
  selector: 'app-keybind',
  standalone: true,
  imports: [
    Chip
  ],
  templateUrl: './keybind.component.html',
  styleUrl: './keybind.component.css'
})
export class KeybindComponent {
  @Input() key!: string;
  @Input() label?: string;
}
