import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';

@Component({
  selector: 'app-bank-menu',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './bank-menu.component.html',
  styleUrl: './bank-menu.component.css',
})
export class BankMenuComponent {

  constructor(private rageClientService: RageClientService) {
  }

  closeMenu() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_TOGGLE_BANK_MENU, false);
  }
}
