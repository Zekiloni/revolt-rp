import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, ChangeDetectionStrategy, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IRadioStation, IVehicleXmrState, ProcedureKey, radioStationsConfig } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { fadeInOutTrigger } from '../../../domain/util/animation.util';

@Component({
  selector: 'app-vehicle-xmr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-xmr.component.html',
  styleUrl: './vehicle-xmr.component.css',
  animations: [fadeInOutTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleXmrComponent implements OnInit, OnDestroy {
  // Using signals for better reactivity and performance (Angular 16+)
  radioOn = signal(false);
  radioStationIndex = signal(0);
  radioVolume = signal(0);
  xmrControlsVisible = signal(false);

  readonly radioStations = radioStationsConfig;

  private readonly volume$ = new Subject<number>();
  private readonly destroy$ = new Subject<void>();

  private readonly genreRegex = /^\s*\[(.+?)\]/;
  private readonly nameCleanRegex = /^\s*\[.+?\]\s*/;

  readonly radioStation = computed(() =>
    this.radioStations[this.radioStationIndex()] || null
  );

  readonly radioStationName = computed(() => {
    const station = this.radioStation();
    if (!station) return '—';
    return station.name.replace(this.nameCleanRegex, '').trim();
  });

  readonly radioStationGenre = computed(() => {
    const station = this.radioStation();
    if (!station) return '';
    return station.name.match(this.genreRegex)?.[1] || '';
  });

  constructor(private readonly rageClientService: RageClientService) {
    this.listenToVolumeChange();
  }

  private listenToVolumeChange(): void {
    this.volume$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(volume => {
        this.updateXmrState({ volume: volume * 0.01});
      });
  }

  onVolumeChange(volume: number): void {
    this.radioVolume.set(volume);
    this.volume$.next(volume);
  }

  private changeRadioStation(radioStation: IRadioStation): void {
    if (!this.radioOn()) return;

    console.log('Changing radio station to:', radioStation?.url);
    this.updateXmrState({ radioStationUrl: radioStation?.url });
  }
  setXmrVisibility = (visible: boolean) => {
    this.xmrControlsVisible.set(visible)
  }

  updateXmrState(xmrState: IVehicleXmrState) {
    this.rageClientService.triggerServer(
      ProcedureKey.SERVER_VEHICLE_XMR_SET,
      xmrState
    );
  }

  nextStation(): void {
    if (!this.radioOn()) return;

    const newIndex = (this.radioStationIndex() + 1) % this.radioStations.length;
    this.radioStationIndex.set(newIndex);
    this.changeRadioStation(this.radioStation());
  }

  previousStation(): void {
    if (!this.radioOn()) return;

    const newIndex =
      (this.radioStationIndex() - 1 + this.radioStations.length) % this.radioStations.length;
    this.radioStationIndex.set(newIndex);
    this.changeRadioStation(this.radioStation());
  }

  toggleXmr(): void {
    const newState = !this.radioOn();
    this.radioOn.set(newState);

    this.updateXmrState({
      toggle: newState,
      ...(newState && { station: this.radioStation() })
    });
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_TOGGLE_XMR_CONTROL, this.setXmrVisibility);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.volume$.complete();
    this.rageClientService.off(ProcedureKey.BROWSER_TOGGLE_XMR_CONTROL, this.setXmrVisibility);
  }
}
