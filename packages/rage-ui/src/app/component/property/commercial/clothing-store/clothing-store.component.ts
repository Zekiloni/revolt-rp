import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-clothing-store',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, Button, TranslatePipe],
  templateUrl: './clothing-store.component.html',
  styleUrl: './clothing-store.component.css'
})
export class ClothingStoreComponent {
  @Input() isActive!: boolean;

  constructor(private rageClientService: RageClientService) {
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_CLOTHING_STORE, null);
  }
}
