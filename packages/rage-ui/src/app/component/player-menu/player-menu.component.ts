import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { RageClientService } from '../../domain/service/rage-client.service';
import { ProcedureKey } from '@revolt-rp/common';
import { MenuItem } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { StaticAssetPipe } from '../../domain/pipe/static-asset.pipe';
import { playerMenuItems } from './player-menu.config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-player-menu',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe, Ripple, StaticAssetPipe],
  templateUrl: './player-menu.component.html',
  styleUrl: './player-menu.component.css'
})
export class PlayerMenuComponent {
  @Input() isActive!: boolean;

  menuItems: MenuItem[] = playerMenuItems;
  activeMenuItem!: MenuItem;

  constructor(private rageClientService: RageClientService) {
    this.show(this.menuItems[0]);
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_PLAYER_MENU);
  }

  show(item: MenuItem) {
    this.activeMenuItem = item;
  }

  isActiveMenuItem(item: MenuItem) {
    return this.activeMenuItem === item;
  }

  protected readonly environment = environment;
}
