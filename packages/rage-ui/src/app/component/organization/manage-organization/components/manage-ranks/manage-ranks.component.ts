import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOrganizationRank } from '@revolt-rp/common';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-manage-ranks',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe, Button],
  templateUrl: './manage-ranks.component.html',
  styleUrl: './manage-ranks.component.css'
})
export class ManageRanksComponent {
  @Input() ranks!: IOrganizationRank[];
}
