import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Button, ButtonDirective } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateRankComponent } from '../create-rank';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { deepCopy, IOrganizationRank, IOrganizationRankCreate } from '@revolt-rp/common';
import { filterGlobal } from '../../../../../domain/util/table.util';


@Component({
  selector: 'app-manage-ranks',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe, Button, ButtonDirective, IconFieldModule, InputIconModule, InputTextModule, ConfirmPopupModule],
  providers: [ConfirmationService, DialogService],
  templateUrl: './manage-ranks.component.html',
  styleUrl: './manage-ranks.component.css'
})
export class ManageRanksComponent {
  protected readonly filterGlobal = filterGlobal;

  @Input() ranks!: IOrganizationRank[];
  @Output() rankCreate = new EventEmitter<IOrganizationRankCreate>();
  @Output() rankDelete = new EventEmitter<IOrganizationRank>();

  rankClones: Record<string, IOrganizationRank> = {};

  constructor(
    private dialogService: DialogService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService
  ) {
  }

  deleteRank(event: MouseEvent, rank: IOrganizationRank) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant('delete_rank_confirm', { rank: rank.name }),
      icon: 'pi pi-question-circle',
      rejectLabel: this.translateService.instant('no'),
      acceptLabel: this.translateService.instant('yes'),
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.rankDelete.emit(rank);
      }
    });
  }

  createRank() {
    this.dialogService.open(CreateRankComponent, {
      header: this.translateService.instant('create_new_rank'),
      width: '25%'
    }).onClose.subscribe((rank?: IOrganizationRankCreate) => {
      if (rank)
        this.rankCreate.emit(rank);
    });
  }

  editInit(rank: IOrganizationRank) {
    this.rankClones[rank.id] = deepCopy(rank);
  }

  editSave(rank: IOrganizationRank, index: number) {
//
  }

  editCancel(rank: IOrganizationRank, index: number) {
    this.ranks[index] = this.rankClones[rank.id];
    delete this.rankClones[rank.id];
  }
}
