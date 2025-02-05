
export interface IPlayerDamageData<T> {
  source: T;
  weapon: number;
  boneIndex: number;
  damage: number;
  timestamp?: number
}
