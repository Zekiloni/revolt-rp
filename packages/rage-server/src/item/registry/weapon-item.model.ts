import { BaseItem } from './base-item.model';
import { IItem } from '@bcrp-rage/common';


export class WeaponItem extends BaseItem {

  constructor() {
    super();
  }

  select(player: PlayerMp, item: IItem): void {
  }

  use(player: PlayerMp, item: IItem): void {
  }

}
