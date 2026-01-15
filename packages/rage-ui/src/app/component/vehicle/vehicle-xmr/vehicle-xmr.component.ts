import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IRadioStation, ProcedureKey, radioStationsConfig } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';

@Component({
  selector: 'app-vehicle-xmr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-xmr.component.html',
  styleUrl: './vehicle-xmr.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleXmrComponent implements OnDestroy {
  // Using signals for better reactivity and performance (Angular 16+)
  radioOn = signal(false);
  radioStationIndex = signal(0);
  radioVolume = signal(0);

  readonly radioStations = radioStationsConfig;

  private readonly volume$ = new Subject<number>();
  private readonly destroy$ = new Subject<void>();

  // Cached regex patterns
  private readonly genreRegex = /^\s*\[(.+?)\]/;
  private readonly nameCleanRegex = /^\s*\[.+?\]\s*/;

  // Computed values - only recalculated when dependencies change
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
        this.rageClientService.triggerServer(
          ProcedureKey.SERVER_VEHICLE_XMR_VOLUME,
          volume
        );
      });
  }

  onVolumeChange(volume: number): void {
    this.radioVolume.set(volume);
    this.volume$.next(volume);
  }

  private changeRadioStation(radioStation: IRadioStation | null): void {
    if (!this.radioOn()) return;

    this.rageClientService.triggerServer(
      ProcedureKey.SERVER_VEHICLE_XMR_SET,
      radioStation?.url
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

    if (newState) {
      this.changeRadioStation(this.radioStation());
    } else {
      this.rageClientService.triggerServer(
        ProcedureKey.SERVER_VEHICLE_XMR_SET,
        null
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.volume$.complete();
  }
}
