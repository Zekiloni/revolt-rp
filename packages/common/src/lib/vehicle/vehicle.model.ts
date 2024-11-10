import { Vector3 } from '../core.interface';
import { ICharacter } from '../player/character/character.model';
import { Ref } from '@typegoose/typegoose';

export interface IVehicleMod {
  type: number;
  index: number;
}

export interface IVehicleNumberplate {
  numberplate: string;
  modelType: number;
  expiringAt: Date;
}

export interface IVehicleExtra {
  extraId: number;
  enabled: boolean;
}


export interface IVehicle {
  id?: string;
  model: string;
  owner?: Ref<ICharacter>;
  fuel: number;
  mileage: number;
  price?: number;
  locked: boolean;
  color: [[number, number, number], [number, number, number]];
  pearlescentColor: number;
  dashboardColor: number;
  trimColor: number;
  windowTint: number;
  wheelType: number;
  wheelColor: number;
  position: Vector3;
  rotation: Vector3;
  neonColor: number;
  dimension: number;
  engine: boolean;
  engineHealth: number;
  paint?: number;
  bodyHealth: number;
  liveryId: number;
  isTemporary?: true;
  mods: IVehicleMod[];
  extras: IVehicleExtra[];
  numberplate?: IVehicleNumberplate;
  createdAt?: Date;
  updatedAt?: Date;
}
