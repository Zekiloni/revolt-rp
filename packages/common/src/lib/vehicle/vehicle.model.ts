import { Vector3 } from '../core.interface';
import { ICharacter } from '../player/character/character.model';
import { Ref } from '@typegoose/typegoose';
import { IItem } from '../item/item.model';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { IProperty } from '../property/property.model';
import { MenuItem } from 'primeng/api';
import { ProcedureKey } from '../procedure.enums';
import { IOrganization } from '../organization/organization.model';

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

export interface IVehicleStats {
  displayName: string;
  className: string;
  maxSpeed: number;
  maxNumberOfPassengers: number;
  acceleration: number;
  maxBraking: number;
  maxTraction: number;
}

export interface IVehicle extends Base {
  model: string;
  owner?: Ref<ICharacter>;
  organization?: Ref<IOrganization>;
  fuel: number;
  mileage: number;
  price?: number;
  locked: boolean;
  trunk: Ref<IItem>[];
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
  isTemporary: boolean;
  mods: IVehicleMod[];
  extras: IVehicleExtra[];
  numberplate?: IVehicleNumberplate;
  rented?: true;
  rentAgencyId?: string;
  expiringAt?: Date;
  isSpawned: boolean;
  createdAt: Date;
  updatedAt?: Date;
}


export interface IVehicleUpdateData {
  vehicleId: number;
  mileage: number;
  fuel: number;
}


export interface IVehicleOption extends MenuItem {
  label: string;
  description?: string;
  eventKey: ProcedureKey;
}
