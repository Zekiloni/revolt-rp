import { IItem } from '@bcrp-rage/common';
import { Types } from 'mongoose';


export class Item implements IItem {
  declare _id: Types.ObjectId;
  declare id: string;

  ammoInClip: number;
  buildProgress: number;
  dimension: number;
  dropped: boolean;
  durability: number;
  expiringAt: Date;
  name: string;
  percentageOfDamage: number;
  position: Vector3;
  purity: number;
  quantity: number;
  rotation: Vector3;
  serialNo: string;
}
