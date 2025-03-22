import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { IPhonePhoto, PlayerPhoneState, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { ImgurClientService } from '../../../../../domain/service/imgur-client.service';
import { imageElementToBlob, loadImageFromUrl } from '../../../../../domain/util/camera.util';
import { ImgurUploadResponse } from '../../../../../domain/model/imgur/imgur.model';
import { mapToPhonePhoto } from '../../../../../domain/util/phone.util';
import { addPhonePhoto, PhoneState } from '../../../../../store/phone';


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


  constructor(
    private rageClientService: RageClientService,
    private imgurClientService: ImgurClientService,
    private store: Store<PhoneState>) {
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
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PHONE_CAMERA_TAKE_PHOTO);
    this.captureCamera(false);
  }

  handlePhotoUploaded = (image: ImgurUploadResponse) => {
    this.rageClientService.callServer<IPhonePhoto>(ProcedureKey.SERVER_PHONE_ADD_PHOTO, mapToPhonePhoto(image))
      .subscribe({ next: (photo) => this.store.dispatch(addPhonePhoto({ photo })) });

    this.captureCamera(true);
  };

  async savePhoto() {
    const img = await loadImageFromUrl(this.cameraRef.nativeElement.src);

    const blob = await imageElementToBlob(img as HTMLImageElement);

    this.imgurClientService.uploadImage(blob)
      .subscribe({
        next: (response) => this.handlePhotoUploaded(response),
        error: (error) => console.error(JSON.stringify(error))
      });
  }

  cancelPhoto() {
    this.captureCamera(true);
  }

  ngOnInit(): void {
    this.captureCamera(true);
  }

  ngOnDestroy(): void {
    this.captureCamera(false);
  }
}
