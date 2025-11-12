import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { KeybindComponent } from '../../misc/keybind';
import { FormsModule } from '@angular/forms';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';
import { Button } from 'primeng/button';
import { BehaviorSubject, interval, map, startWith, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-fishing',
  standalone: true,
  templateUrl: './fishing.component.html',
  styleUrls: ['./fishing.component.css'],
  imports: [ProgressBar, KeybindComponent, FormsModule, Button, AsyncPipe]
})
export class FishingComponent implements OnInit, OnDestroy {
  tensionSignal = 0;
  floatSignal = 0;

  // Player indicator is no longer moving, green zone is fixed
  catchZonePosition = 40; // center position left %
  catchZoneSize = 20; // width of green zone
  private minZoneSize = 5;
  private maxZoneSize = 100;

  depth = 3.2;
  distance = 12.4;

  timer$: BehaviorSubject<string> = new BehaviorSubject('00:00');
  private timerSub?: Subscription;
  private startTime = Date.now();

  private moveInterval?: any;
  private hasTension = false;

  private shrinkRate = 0.2; // % per tick
  private growRate = 2; // % per space key press
  private tickInterval = 50;

  constructor(private rageClientService: RageClientService) {}


  updateGame = (data: { floatSignal: number; depth: number; distance: number; tensionSignal: number }) => {
    this.tensionSignal = data.tensionSignal;
    this.depth = data.depth;
    this.distance = data.distance;
    this.floatSignal = data.floatSignal;

    if (data.tensionSignal > 0 && !this.hasTension) this.startTension();
    else if (data.tensionSignal === 0 && this.hasTension) this.stopTension();
  };

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, this.updateGame);

    this.timerSub = interval(1000).pipe(
      startWith(0),
      map(() => {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      })
    ).subscribe(val => this.timer$.next(val));
  }

  ngOnDestroy() {

    if (this.timerSub)
      this.timerSub.unsubscribe();

    this.rageClientService.off(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, this.updateGame);
  }
}
