import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { interval, map, Observable, startWith } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';


interface IALPRData {
  displayName: string;
  speed: number;
  numberplate: string;
}

@Component({
  selector: 'app-plate-recognition',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './plate-recognition.component.html',
  styleUrl: './plate-recognition.component.css'
})
export class PlateRecognitionComponent implements OnInit, OnDestroy {
  numberplate = 'N/A';
  speed = 0;
  displayName = 'N/A';
  position: [number, number] = [0, 0];
  officer = 'N/A';

  $time: Observable<Date> = interval(1000).pipe(
    startWith(0),
    map(() => {
      return new Date();
    })
  );

  constructor(private rageClientService: RageClientService) {
  }

  private setTarget = (data: IALPRData) => {
    this.numberplate = data.numberplate;
    this.speed = Math.round(data.speed);
    this.displayName = data.displayName;
  };

  private setOfficer = (officer: string) => {
    this.officer = officer;
  };

  private setPosition = (position: { x: number, y: number, z: number }) => {
    this.position = [position.x, position.y];
  };

  ngOnInit() {
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_ALPR_TARGET, this.setTarget);
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_ALPR_OFFICER, this.setOfficer);
    this.rageClientService.on(ProcedureKey.BROWSER_UPDATE_ALPR_POSITION, this.setPosition);
  }

  ngOnDestroy() {
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_ALPR_TARGET, this.setTarget);
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_ALPR_OFFICER, this.setOfficer);
    this.rageClientService.off(ProcedureKey.BROWSER_UPDATE_ALPR_POSITION, this.setPosition);
  }
}
