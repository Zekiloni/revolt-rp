import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { SliderModule } from 'primeng/slider';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeadOverlayComponentDef } from '@bcrp-rage/common';
import { HeadOverlayComponentForm } from '../../../../domain/model/character';

@Component({
  selector: 'app-head-overlay',
  standalone: true,
  imports: [CommonModule, DropdownModule, PaginatorModule, ReactiveFormsModule, SliderModule],
  templateUrl: './head-overlay.component.html',
  styleUrl: './head-overlay.component.css'
})
export class HeadOverlayComponent {
  private readonly _headOverlayValue = 'value';

  @Input() headOverlayInfo!: HeadOverlayComponentDef;
  @Input() headOverlayForm!: FormGroup<HeadOverlayComponentForm>;

  onHeadOverlayClear() {
    this.headOverlayForm.get(this._headOverlayValue)?.setValue(255);
  }

  get values() {
    return this.headOverlayInfo.values.map((val, index) => ({ label: val, value: index }));
  }
}
