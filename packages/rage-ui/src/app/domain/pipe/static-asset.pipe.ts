import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BASE_HREf } from '../variables';

@Pipe({
  name: 'staticAsset',
  standalone: true
})
export class StaticAssetPipe implements PipeTransform {

  constructor(@Inject(BASE_HREf) private baseHref: string) {
  }

  transform(value: string): string {
    return `${this.baseHref}/${value}`;
  }
}
