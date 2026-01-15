import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IRadioStation, ProcedureKey, radioStationsConfig } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';

@Component({
  selector: 'app-vehicle-xmr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-xmr.component.html',
  styleUrl: './vehicle-xmr.component.css'
})
export class VehicleXmrComponent implements OnDestroy {
  radioOn = false;
  radioStationIndex = 0;
  radioVolume = 0;
  radioStations = radioStationsConfig;

  private volume$ = new Subject<number>();
  private destroy$ = new Subject<void>();

  get radioStation(): IRadioStation | null {
    return this.radioStations[this.radioStationIndex] || null;
  }

  get radioStationName() {
    return this.radioStation?.name.replace(/^\s*\[.+?\]\s*/, '').trim()
  }

  get radioStationGenre() {
    return this.radioStation?.name.match(/^\s*\[(.+?)\]/)?.[1];
  }

  constructor(private rageClientService: RageClientService) {
    this.listenToVolumeChange();
  }

  private listenToVolumeChange() {
    this.volume$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(volume => {
        this.rageClientService.triggerServer(
          ProcedureKey.SERVER_VEHICLE_XMR_VOLUME,
          volume
        );
      });
  }

  onVolumeChange(volume: number) {
    this.volume$.next(volume);
  }

  changeRadioStation(radioStation: IRadioStation | null) {
    this.rageClientService.triggerServer(ProcedureKey.SERVER_VEHICLE_XMR_SET, radioStation?.url);
  }

  nextStation() {
    this.radioStationIndex = (this.radioStationIndex + 1) % this.radioStations.length;
    this.changeRadioStation(this.radioStation);
  }

  previousStation() {
    this.radioStationIndex =
      (this.radioStationIndex - 1 + this.radioStations.length) % this.radioStations.length;
    this.changeRadioStation(this.radioStation);
  }

  toggleXmr() {
    this.radioOn = !this.radioOn;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
