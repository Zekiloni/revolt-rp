import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { KeybindComponent } from '../../misc/keybind';
import { Slider } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-fishing',
  standalone: true,
  templateUrl: './fishing.component.html',
  styleUrls: ['./fishing.component.css'],
  imports: [ProgressBar, KeybindComponent, Slider, FormsModule, Button]
})
export class FishingComponent implements OnInit, OnDestroy {
  tensionSignal = 0;
  floatSignal = 0;

  reelWindow: [number, number] = [45, 55]; // slider
  depth = 3.2;
  distance = 12.4;
  private startTime = Date.now();

  private moveInterval?: any;
  private hasTension = false;

  // Fish fight mechanics
  private fishTarget = 50; // fish's target center
  private windowMomentum = 0;
  private fishSpeed = 0.5;
  private momentumDecay = 0.85;
  private catchZone: [number, number] = [45, 50]; // player must keep center here

  constructor(private rageClientService: RageClientService) {}

  get timerDisplay(): string {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  }

  updateGame = (data: { floatSignal: number, depth: number, distance: number, tensionSignal: number }) => {
    this.tensionSignal = data.tensionSignal;
    this.depth = data.depth;
    this.distance = data.distance;
    this.floatSignal = data.floatSignal;

    if (data.tensionSignal > 0 && !this.hasTension) this.startTension();
    else if (data.tensionSignal === 0 && this.hasTension) this.stopTension();
  };

  startTension() {
    this.hasTension = true;
    this.fishTarget = 50; // reset fish target
    this.windowMomentum = 0;
    this.fishSpeed = 0.5 + Math.random() * 1.0;

    this.moveInterval = setInterval(() => {
      let [start, end] = this.reelWindow;
      const mid = (start + end) / 2;

      // Fish occasionally changes target
      if (Math.random() < 0.05) this.fishTarget = 10 + Math.random() * 80;

      // Calculate pull from fish
      const pull = (this.fishTarget - mid) * this.fishSpeed;
      this.windowMomentum = this.windowMomentum * this.momentumDecay + pull;

      start += this.windowMomentum;
      end += this.windowMomentum;

      // Clamp to 0-100
      start = Math.max(0, Math.min(100, start));
      end = Math.max(0, Math.min(100, end));
      this.reelWindow = [start, end];

      // Lose if reaches edges
      if (mid <= 0 || mid >= 100) this.loseCatch();

    }, 100);
  }

  stopTension() {
    this.hasTension = false;
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = undefined;
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.hasTension) return;

    const step = 2.5;
    if (event.key === 'a' || event.key === 'ArrowLeft') this.windowMomentum -= step;
    if (event.key === 'd' || event.key === 'ArrowRight') this.windowMomentum += step;

    const mid = (this.reelWindow[0] + this.reelWindow[1]) / 2;

    // Win if player keeps reel window in catch zone for at least 1 tick
    if (mid >= this.catchZone[0] && mid <= this.catchZone[1]) this.winCatch();
  }

  winCatch() {
    this.stopTension();
    console.log('🎣 Fish caught!');
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_STOP_FISHING);
  }

  loseCatch() {
    this.stopTension();
    console.log('💀 The fish got away!');
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_STOP_FISHING);
  }

  cancelFishing() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_STOP_FISHING);
  }

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, this.updateGame);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_FISHING_MINIGAME_UPDATE, this.updateGame);
    this.stopTension();
  }
}
