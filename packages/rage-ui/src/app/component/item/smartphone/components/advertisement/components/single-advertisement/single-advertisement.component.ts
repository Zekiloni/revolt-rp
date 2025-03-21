import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ChipsModule } from 'primeng/chips';
import { ButtonDirective } from 'primeng/button';
import { IAdvertisement, ICharacter, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../../../domain/service/rage-client.service';


@Component({
  selector: 'app-single-advertisement',
  standalone: true,
  imports: [CommonModule, TranslatePipe, EditorModule, FormsModule, TagModule, ChipsModule, ButtonDirective],
  templateUrl: './single-advertisement.component.html',
  styleUrl: './single-advertisement.component.css'
})
export class SingleAdvertisementComponent {
  @Input() advertisement!: IAdvertisement;

  constructor(private rageClientService: RageClientService) {
  }

  get author() {
    return this.advertisement.author as ICharacter;
  }

  call(phoneNumber: string) {
    this.rageClientService.triggerServer(ProcedureKey.SERVER_CREATE_PHONE_CALL, phoneNumber);
  }
}
