import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IFishReward, ProcedureKey } from '@revolt-rp/common';
import { BehaviorSubject, interval, map, startWith, Subscription } from 'rxjs';
import { Slider } from 'primeng/slider';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { KeybindComponent } from '../../misc/keybind';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-fishing',
  standalone: true,
  templateUrl: './fishing.component.html',
  styleUrls: ['./fishing.component.css'],
  imports: [KeybindComponent, FormsModule, Slider, Dialog, Button, TranslatePipe, JsonPipe]
})
export class FishingComponent implements OnInit, OnDestroy {
  fishCaught: IFishReward | null = null;

  lineTension = 0;
  reelWindow = 0;
  depth = 3.2;
  distance = 12.4;

  timer$: BehaviorSubject<string> = new BehaviorSubject('00:00');
  private timerSub?: Subscription;
  private startTime = Date.now();

  constructor(private rageClientService: RageClientService) {}

  get isVisible() {
    return this.fishCaught != null;
  }

  updateGame = (data: {
    depth: number;
    distance: number;
    lineTension: number;
    reelWindow: number;
  }) => {
    for (const key in data) {
      if (data[key as keyof typeof data] == null)
        return;
    }
    this.lineTension = data.lineTension;
    this.depth = data.depth;
    this.distance = data.distance;
    this.reelWindow = data.reelWindow;
  };

  setReward = (reward: IFishReward | null) => {
    this.fishCaught = reward;
    this.rageClientService.invoke('focus', !!reward);
  }

  release() {
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_FISH_RESPONSE, false);
    this.setReward(null)
  }

  take() {
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_FISH_RESPONSE, true);
    this.setReward(null)
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, this.updateGame);
    this.rageClientService.on(ProcedureKey.BROWSER_FISHING_SET_REWARD, this.setReward);

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

    this.rageClientService.off(ProcedureKey.BROWSER_FISHING_SET_REWARD, this.setReward);
    this.rageClientService.off(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, this.updateGame);
  }
}
