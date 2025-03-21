import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { PlayerPhoneState, ProcedureKey } from '@revolt-rp/common';
import { ButtonDirective } from 'primeng/button';
import { ImgurClientService } from '../../../../../domain/service/imgur-client.service';
import { blobToBase64, imageElementToBlob, loadImageFromUrl } from '../../../../../domain/util/camera.util';


@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, ButtonDirective],
  providers: [ImgurClientService],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent implements OnInit, OnDestroy {
  @Input() phoneItem!: IPhoneItem;

  @ViewChild('cameraRef', { static: false }) cameraRef!: ElementRef<HTMLImageElement>;

  cameraCaptureInterval: NodeJS.Timeout | null = null;
  cameraType: PlayerPhoneState.BackCamera | PlayerPhoneState.FrontCamera = PlayerPhoneState.FrontCamera;

  constructor(private rageClientService: RageClientService, private imgurClientService: ImgurClientService) {
  }

  @HostListener('document:keydown', ['$event'])
  async onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Control':
        this.changeCameraType();
        break;
      case ' ':
        await this.takePhoto();
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

  async takePhoto() {
    this.captureCamera(false);

    const img  = await loadImageFromUrl(this.cameraRef.nativeElement.src);

    const blob = await imageElementToBlob(img as HTMLImageElement);
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PHONE_CAMERA_TAKE_PHOTO);

    const name = Date.now().toString()
    const base64 = await blobToBase64(blob);

    this.imgurClientService.uploadImage(blob)
      .subscribe({
        next: (response) => console.log(JSON.stringify(response)),
        error: (error) => console.error(JSON.stringify(error))
      });
  }

  ngOnInit(): void {
    this.captureCamera(true);
  }

  ngOnDestroy(): void {
    this.captureCamera(false);
  }
}
