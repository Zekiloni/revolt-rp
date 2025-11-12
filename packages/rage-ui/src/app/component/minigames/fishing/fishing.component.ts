import { Component, OnDestroy, OnInit } from '@angular/core';
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
  reelWindow = 0;
  depth = 3.2;
  distance = 12.4;

  timer$: BehaviorSubject<string> = new BehaviorSubject('00:00');
  private timerSub?: Subscription;
  private startTime = Date.now();

  constructor(private rageClientService: RageClientService) {}

  updateGame = (data: {
    floatSignal: number;
    depth: number;
    distance: number;
    tensionSignal: number;
    reelWindow: number;
  }) => {
    this.tensionSignal = data.tensionSignal;
    this.depth = data.depth;
    this.distance = data.distance;
    this.floatSignal = data.floatSignal;
    this.reelWindow = data.reelWindow;
  };

  stopFishing() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_STOP_FISHING);
  }

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
