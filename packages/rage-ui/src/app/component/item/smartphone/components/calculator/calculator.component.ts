import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import { ButtonDirective } from 'primeng/button';
import { calculate } from '../../../../../domain/util/math.util';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ChipsModule, ButtonDirective],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  input = '';

  appendValue(value: string) {
    this.input += value;
  }

  calculate() {
    if (this.input === 'Error') {
      return this.clearInput();
    }

    try {
      this.input = calculate(this.input);
    } catch (e) {
      this.input = 'Error';
    }
  }

  clearInput() {
    this.input = '';
  }
}
