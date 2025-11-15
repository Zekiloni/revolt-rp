

export interface IFishType {
  name: string;
  description?: string;
  chance: number;
  weightRange: [number, number];
}

export interface IFishReward {
  type: IFishType;
  weight: number;
}
