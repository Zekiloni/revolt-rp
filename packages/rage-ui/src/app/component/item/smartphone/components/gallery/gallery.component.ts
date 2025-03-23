import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { PhoneState, removePhonePhoto } from '../../../../../store/phone';
import { dayjs } from '../../../../../domain/util/dajys.util';


@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ImageModule, ButtonDirective],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  @Input() phoneItem!: IPhoneItem;

  constructor(private rageClientService: RageClientService, private store: Store<PhoneState>) {
  }

  get images() {
    return this.phoneItem.phoneInfo.gallery
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }


  fromNow(date: Date) {
    return dayjs(date).fromNow(false);
  }

  private handlePhotoDeleted(photoId: string) {
    this.store.dispatch(removePhonePhoto({ photoId }));
  }

  deleteImage(photoId: string) {
    this.rageClientService.callServer<void>(ProcedureKey.SERVER_PHONE_DELETE_PHOTO, photoId)
      .subscribe({ next: () => this.handlePhotoDeleted(photoId) });
  }
}
