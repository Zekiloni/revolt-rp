import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { IAdvertisement, ICharacter } from '@revolt-rp/common';

@Component({
  selector: 'app-single-advertisement',
  standalone: true,
  imports: [CommonModule, TranslatePipe, EditorModule, FormsModule, TagModule],
  templateUrl: './single-advertisement.component.html',
  styleUrl: './single-advertisement.component.css'
})
export class SingleAdvertisementComponent {
  @Input() advertisement!: IAdvertisement;

  get author() {
    return this.advertisement.author as ICharacter;
  }
}
