import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeybindComponent } from '../../misc/keybind';
import { FormsModule } from '@angular/forms';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';
import { BehaviorSubject, interval, map, startWith, Subscription } from 'rxjs';
import { Slider } from 'primeng/slider';

@Component({
  selector: 'app-fishing',
  standalone: true,
  templateUrl: './fishing.component.html',
  styleUrls: ['./fishing.component.css'],
  imports: [ KeybindComponent, FormsModule, Slider]
})
export class FishingComponent implements OnInit, OnDestroy {
  lineTension = 0;
  reelWindow = 0;
  depth = 3.2;
  distance = 12.4;

  timer$: BehaviorSubject<string> = new BehaviorSubject('00:00');
  private timerSub?: Subscription;
  private startTime = Date.now();

  constructor(private rageClientService: RageClientService) {}

  updateGame = (data: {
    depth: number;
    distance: number;
    lineTension: number;
    reelWindow: number;
  }) => {
    this.lineTension = data.lineTension;
    this.depth = data.depth;
    this.distance = data.distance;
    this.reelWindow = data.reelWindow;
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
