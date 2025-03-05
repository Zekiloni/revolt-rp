import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommandCategory, GameUiKey, ICommandBase, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { filterGlobal } from '../../domain/util/table.util';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe, TableModule, IconFieldModule, InputIconModule, InputTextModule, TagModule, DropdownModule, FormsModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  protected readonly filterGlobal = filterGlobal;

  @Input() isActive!: boolean;
  @Input() commands!: ICommandBase[];

  categorySearch: string | null = null;

  get categories() {
    return Array.from(new Set(this.commands.map(command => command.category || CommandCategory.General)));
  }

  constructor(private rageClientService: RageClientService) {
  }

  getCategorySeverity(category: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (category) {
      case CommandCategory.Admin:
        return 'danger';
      case CommandCategory.Organization:
        return 'warning';
      case CommandCategory.Vehicle:
        return 'info';
      case CommandCategory.Property:
        return 'success';
      default:
        return 'secondary';
    }
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.BROWSER_HIDE_GAME_INTERFACE, GameUiKey.HelpMenu);
  }
}
