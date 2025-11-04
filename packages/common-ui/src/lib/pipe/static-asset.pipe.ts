import { Inject, Pipe, PipeTransform } from '@angular/core';
import { API_BASE_HREF } from '../variables';

@Pipe({
  name: 'staticAsset',
  standalone: true
})
export class StaticAssetPipe implements PipeTransform {

  constructor(@Inject(API_BASE_HREF) private baseHref: string) {
  }

  transform(value: string): string {
    return `${this.baseHref.replace('api', '')}/${value}`;
  }
}
