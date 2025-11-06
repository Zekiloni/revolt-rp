import type { FilterQuery } from 'mongoose';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { IProperty } from '@revolt-rp/common';
import { BaseApiService } from './base-api.service';

@Injectable({providedIn: 'root'})
export class PropertyService extends BaseApiService {

  getAllProperties(filter: FilterQuery<IProperty>, limit = 50, offset = 0) {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    console.log('filter', filter);
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }

    console.log('Fetching properties with params:', params.toString());

    return this.httpClient.get<{ properties: IProperty[], total: number }>(this.getApiPath('property'), {
      params
    });
  }
}
