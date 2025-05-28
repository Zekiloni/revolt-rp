
export interface IVehicleHudUpdate {
  type: 'fly' | 'ground' | 'water';
  speed: number;
  gear: number;
  rpm: number;
  fuel: number;
  mileage: number;
  lightsOn: boolean;
  highBeamsOn: boolean;
  height: number;
  pitch: number;
  roll: number;
}
