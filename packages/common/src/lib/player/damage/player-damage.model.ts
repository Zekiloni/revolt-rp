import { CaliberType } from '../../item/registry/caliber-type';

export interface IPlayerDamageData<T> {
  source: T;
  weaponHash: number;
  boneIndex: number;
  damage: number;
  timestamp?: number
  caliberType?: CaliberType
}
