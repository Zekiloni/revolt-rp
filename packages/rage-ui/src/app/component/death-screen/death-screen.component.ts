import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RageClientService } from '../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';
import { interval, Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-death-screen',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './death-screen.component.html',
  styleUrl: './death-screen.component.css'
})
export class DeathScreenComponent implements OnInit, OnDestroy {
  private timerSubscription: Subscription | null = null;
  remainingTime = 0;

  constructor(private rageClientService: RageClientService) {
  }

  private setDeathScreen = (remainingTime: number) => {
    this.remainingTime = remainingTime;
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        if (this.timerSubscription)
          this.timerSubscription.unsubscribe();
      }
    });
  };

  ngOnInit() {
    this.rageClientService.callServer<number>(ProcedureKey.SERVER_PLAYER_GET_WOUND_TIMER).subscribe({
      next: this.setDeathScreen
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
