import type { FilterQuery } from 'mongoose';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { IVehicle } from '@revolt-rp/common';
import { BaseApiService } from './base-api.service';

@Injectable({providedIn: 'root'})
export class VehicleService extends BaseApiService {

  getAllVehicles(filter: FilterQuery<IVehicle>, limit = 50, offset = 0) {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }

    return this.httpClient.get<{ vehicles: IVehicle[], total: number }>(this.getApiPath('vehicle'), {
      params
    });
  }
}
