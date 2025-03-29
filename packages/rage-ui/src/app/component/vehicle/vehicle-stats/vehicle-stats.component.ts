import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IVehicleStats, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-vehicle-stats',
  standalone: true,
  imports: [CommonModule, ProgressBarModule, TranslatePipe],
  templateUrl: './vehicle-stats.component.html',
  styleUrl: './vehicle-stats.component.css'
})
export class VehicleStatsComponent implements OnInit {
  @Input() model!: string;

  vehicleStats: IVehicleStats | undefined;

  constructor(private rageClientService: RageClientService) {
  }


  getSeats(value: number) {
    return Array.from({ length: value }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    this.rageClientService.callClient<IVehicleStats | undefined>(ProcedureKey.CLIENT_GET_VEHICLE_STATS, this.model)
      .subscribe({ next: stats => this.vehicleStats = stats });
  }
}
