import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ImageModule } from 'primeng/image';
import { dayjs } from '../../../../../domain/util/dajys.util';
import { ButtonDirective } from 'primeng/button';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';
import { PhoneState, removePhonePhoto } from '../../../../../store/phone';
import { Store } from '@ngrx/store';


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
