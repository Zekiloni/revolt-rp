import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { PlayerPhoneState, ProcedureKey } from '@revolt-rp/common';
import { ButtonDirective } from 'primeng/button';


@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, ButtonDirective],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent implements OnInit, OnDestroy {
  @ViewChild('cameraRef', { static: false }) cameraRef!: ElementRef<HTMLImageElement>;

  cameraCaptureInterval: NodeJS.Timeout | null = null;
  cameraType: PlayerPhoneState.BackCamera | PlayerPhoneState.FrontCamera = PlayerPhoneState.FrontCamera;

  constructor(private rageClientService: RageClientService) {
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Control':
        this.changeCameraType()
        break;
      case ' ':
        this.captureCamera(false);
        break;
    }
  }

  changeCameraType(): void {
    this.cameraType = this.cameraType === PlayerPhoneState.FrontCamera ? PlayerPhoneState.BackCamera : PlayerPhoneState.FrontCamera;
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PHONE_CAMERA_TOGGLE, this.cameraType);
  }

  captureCamera(toggle: boolean) {
    this.rageClientService.invoke('focus', !toggle);

    if (toggle) {
      this.cameraCaptureInterval = setInterval(() => {
        if (this.cameraRef && this.cameraRef.nativeElement) {
          this.cameraRef.nativeElement.src = 'http://screenshots/take';
        }
      }, 50);

      this.rageClientService.triggerClient(ProcedureKey.CLIENT_PHONE_CAMERA_TOGGLE, this.cameraType);
    } else {
      if (this.cameraCaptureInterval) {
        clearInterval(this.cameraCaptureInterval);
        this.cameraCaptureInterval = null;
      }
      this.rageClientService.triggerClient(ProcedureKey.CLIENT_PHONE_CAMERA_TOGGLE, PlayerPhoneState.Idle);
    }
  }

  takePhoto() {
    this.captureCamera(false);
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PHONE_CAMERA_TAKE_PHOTO);
  }

  ngOnInit(): void {
    this.captureCamera(true);
  }

  ngOnDestroy(): void {
    this.captureCamera(false);
  }
}
