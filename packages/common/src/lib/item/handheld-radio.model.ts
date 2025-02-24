
export interface IHandheldRadioConfig {
  power: boolean;
  frequency: string | null;
  simplex: 1 | 2 | 3;
  isConnected: boolean;
}
