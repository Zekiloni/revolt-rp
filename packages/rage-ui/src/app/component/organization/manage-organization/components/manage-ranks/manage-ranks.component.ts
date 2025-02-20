import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOrganizationRank, IOrganizationRankCreate } from '@revolt-rp/common';
import { TableModule } from 'primeng/table';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Button, ButtonDirective } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateRankComponent } from '../create-rank';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { filterGlobal } from '../../../../../domain/util/table.util';

@Component({
  selector: 'app-manage-ranks',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe, Button, ButtonDirective, IconFieldModule, InputIconModule, InputTextModule],
  providers: [DialogService],
  templateUrl: './manage-ranks.component.html',
  styleUrl: './manage-ranks.component.css'
})
export class ManageRanksComponent {
  @Input() ranks!: IOrganizationRank[];
  @Output() rankCreate = new EventEmitter<IOrganizationRankCreate>();

  constructor(private dialogService: DialogService, private translateService: TranslateService) {
  }

  editRank(rank: IOrganizationRank) {
    // todo
  }

  deleteRank(rank: IOrganizationRank) {
    // todo
  }

  createRank() {
    this.dialogService.open(CreateRankComponent, {
      header: this.translateService.instant('create_new_rank'),
      width: '25%',
    }).onClose.subscribe((rank?: IOrganizationRankCreate) => {
      if (rank)
        this.rankCreate.emit(rank);
    });
  }

  protected readonly filterGlobal = filterGlobal;
}
