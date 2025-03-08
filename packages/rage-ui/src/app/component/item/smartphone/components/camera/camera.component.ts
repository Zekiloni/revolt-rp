import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { triggerServer } from '@libertymp/rage-rpc';
import { PlayerPhoneState, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';


@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent implements OnInit, OnDestroy {
  @ViewChild('cameraRef', { static: false }) cameraRef!: ElementRef<HTMLImageElement>;
  photoTaken = false;

  constructor(private rageClientService: RageClientService) {
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      this.photoTaken = !this.photoTaken;
    }
  }

  ngOnInit(): void {
    triggerServer(ProcedureKey.SERVER_SET_PHONE_STATE, PlayerPhoneState.FrontCam);
    this.rageClientService.invoke('focus', false);

    setInterval(() => {
      if (this.photoTaken)
        return;

      if (this.cameraRef && this.cameraRef.nativeElement) {
        this.cameraRef.nativeElement.src = 'http://screenshots/take';
      }
    }, 50);
  }

  ngOnDestroy(): void {
    this.rageClientService.invoke('focus', true);
    triggerServer(ProcedureKey.SERVER_SET_PHONE_STATE, PlayerPhoneState.Idle);
  }
}
