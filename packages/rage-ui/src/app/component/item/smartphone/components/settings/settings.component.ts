import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { SliderChangeEvent, SliderModule } from 'primeng/slider';
import { PhoneState, setPhoneBackground, setPhoneOpacity } from '../../../../../store/phone';
import { StaticAssetPipe } from '../../../../../domain/pipe/static-asset.pipe';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SliderModule, FormsModule, TranslatePipe, StaticAssetPipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  @Input() phoneItem!: IPhoneItem;

  readonly backgrounds = [
    'assets/images/phone/backgrounds/1.jpg',
    'assets/images/phone/backgrounds/2.jpg',
    'assets/images/phone/backgrounds/3.jpg',
    'assets/images/phone/backgrounds/4.jpg',
    'assets/images/phone/backgrounds/5.jpg'
  ];

  opacity!: number;

  constructor(@Inject(Store) private store: Store<PhoneState>) {
  }

  ngOnInit(): void {
    this.opacity = this.phoneItem.phoneInfo.opacity;
  }

  onOpacityChange(event: SliderChangeEvent) {
    this.store.dispatch(setPhoneOpacity({ opacity: (<number>event.value) }));
  }

  changePhoneBackground(background: string) {
    this.store.dispatch(setPhoneBackground({ background }));
  }
}
