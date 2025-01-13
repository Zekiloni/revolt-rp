import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { SliderModule } from 'primeng/slider';
import { Ripple } from 'primeng/ripple';
import { maxParentId, parentNames } from '@revolt-rp/common';
import { HeadBlendDataForm } from '../../../../domain/model/character';

@Component({
  selector: 'app-head-blend-data',
  standalone: true,
  imports: [CommonModule, AvatarModule, ReactiveFormsModule, InputTextModule, SliderModule, Ripple],
  templateUrl: './head-blend-data.component.html',
  styleUrl: './head-blend-data.component.css'
})
export class HeadBlendDataComponent{
  protected readonly maxParentId = maxParentId;

  @Input() headBlendData!: FormGroup<HeadBlendDataForm>;

  getParentImage(parentId: number) {
    const parentName = parentNames[parentId];
    return `/assets/images/gta_protagonists/${parentName}.png`;
  }

  getParentName(parentId: number) {
    return parentNames[parentId] ?? 'Unknown';
  }
}
