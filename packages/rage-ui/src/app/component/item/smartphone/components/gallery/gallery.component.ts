import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';


@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, TranslatePipe, CarouselModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  @Input() phoneItem!: IPhoneItem;

  get images() {
    return this.phoneItem.phoneInfo.gallery;
  }
}
