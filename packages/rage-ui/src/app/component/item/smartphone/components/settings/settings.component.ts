import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SliderChangeEvent, SliderModule } from 'primeng/slider';
import { IPhoneSettingsUpdate, ProcedureKey } from '@revolt-rp/common';
import { PhoneState, setPhoneBackground, setPhoneOpacity } from '../../../../../store/phone';
import { StaticAssetPipe } from '../../../../../domain/pipe/static-asset.pipe';
import { RageClientService } from '../../../../../domain/service/rage-client.service';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SliderModule, FormsModule, TranslatePipe, StaticAssetPipe, InputTextModule],
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

  settings!: IPhoneSettingsUpdate;
  private opacityChangeSubject = new Subject<number>();

  constructor(private rageClientService: RageClientService, private store: Store<PhoneState>) {
  }

  ngOnInit(): void {
    this.settings = {
      opacity: this.phoneItem.phoneInfo.opacity,
      backgroundImage: this.phoneItem.phoneInfo.backgroundImage
    };

    this.opacityChangeSubject.next(this.settings.opacity);
    this.opacityChangeSubject.pipe(
      debounceTime(500),
      switchMap((opacity) => {
        this.settings.opacity = opacity;
        return this.rageClientService.callServer<IPhoneSettingsUpdate>(ProcedureKey.SERVER_UPDATE_PHONE_SETTINGS, this.settings);
      })
    ).subscribe({
      next: this.handlePhoneSettingsUpdate,
      error: (err) => console.error('Error updating phone settings', err)
    });
  }

  private handlePhoneSettingsUpdate = () => {
    this.store.dispatch(setPhoneOpacity({ opacity: this.settings.opacity }));
    this.store.dispatch(setPhoneBackground({ background: this.settings.backgroundImage }));
  };

  private updateSettings() {
    this.rageClientService.callServer<IPhoneSettingsUpdate>(ProcedureKey.SERVER_UPDATE_PHONE_SETTINGS, this.settings)
      .subscribe({ next: this.handlePhoneSettingsUpdate });
  }

  onOpacityChange(event: SliderChangeEvent) {
    this.opacityChangeSubject.next(event.value as number);
  }

  changePhoneBackground(background: string) {
    this.settings.backgroundImage = background;
    this.updateSettings();
  }
}
