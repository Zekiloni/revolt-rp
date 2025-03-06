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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslatePipe, TableModule, IconFieldModule, InputIconModule, InputTextModule, TagModule, DropdownModule, FormsModule, InputGroupModule, InputGroupAddonModule, Button],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  protected readonly filterGlobal = filterGlobal;

  @Input() isActive!: boolean;
  @Input() commands!: ICommandBase[];

  get categories() {
    return Object.values(CommandCategory);
  }

  constructor(private rageClientService: RageClientService) {
  }

  getCategorySeverity(category: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (category) {
      case CommandCategory.Admin:
        return 'danger';
      case CommandCategory.Organization:
        return 'success';
      case CommandCategory.Vehicle:
        return 'info';
      case CommandCategory.Property:
        return 'warning';
      case 'job':
        return 'contrast';
      default:
        return 'secondary';
    }
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.HelpMenu);
  }

  getCommandSyntax(command: ICommandBase) {
    const params = command.params?.map(param => `[${param}]`).join(' ') || '';
    return `/${command.name} ${params}`;
  }

  copyToClipboard(commandSyntax: string) {
    navigator.clipboard.writeText(commandSyntax);
  }

}
