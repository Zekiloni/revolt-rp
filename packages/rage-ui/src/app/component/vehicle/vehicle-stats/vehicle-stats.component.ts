import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IVehicleStats, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProgressBarModule } from 'primeng/progressbar';


@Component({
  selector: 'app-vehicle-stats',
  standalone: true,
  imports: [CommonModule, ProgressBarModule],
  templateUrl: './vehicle-stats.component.html',
  styleUrl: './vehicle-stats.component.css'
})
export class VehicleStatsComponent implements OnInit {
  @Input() model!: string;

  vehicleStats: IVehicleStats | undefined;

  constructor(private rageClientService: RageClientService) {
  }

  ngOnInit(): void {
    this.rageClientService.callClient<IVehicleStats | undefined>(ProcedureKey.CLIENT_GET_VEHICLE_STATS, this.model)
      .subscribe({ next: stats => this.vehicleStats = stats });
  }
}
