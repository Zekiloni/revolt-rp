import { Component, OnDestroy, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { ProgressBar } from 'primeng/progressbar';
import { Chip } from 'primeng/chip';
import { KeybindComponent } from '../../misc/keybind';
import { Slider } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';

@Component({
  selector: 'app-fishing',
  templateUrl: './fishing.component.html',
  styleUrls: ['./fishing.component.css'],
  imports: [
    Card,
    ProgressBar,
    Chip,
    KeybindComponent,
    Slider,
    FormsModule
  ]
})
export class FishingComponent implements OnInit, OnDestroy {
  lineTension = 0;     // %
  reelWindow: [number, number] = [45, 55];

  floatSignal = 0;     // %

  depth = 3.2;          // m
  distance = 12.4;      // m


  private startTime = Date.now();

  constructor(private rageClientService: RageClientService) {
  }

  get timerDisplay(): string {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  updateGame = (data: { waterLevel: number, depth: number, distance: number }) => {
    this.depth = data.depth;
    this.distance = data.distance;
    this.floatSignal = data.waterLevel;
  };

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, this.updateGame);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, this.updateGame);
  }
}
