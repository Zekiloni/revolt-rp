import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { IOrganization } from '../organization/organization.model';
import { ICharacter } from '../player/character/character.model';
import { ProcedureKey } from '../procedure.enums';
import { IVector3 } from '../core.interface';
import { IItem } from '../item/item.model';
import { JobKey } from '../job/job.enums';

export interface IVehicleMod {
  type: number;
  index: number;
}

export interface IVehicleNumberplate {
  content: string;
  modelType: number;
  expiringAt: Date;
  vehicleId: string;
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
  position: IVector3;
  rotation: IVector3;
  neonColor: number;
  dimension: number;
  engine: boolean;
  engineHealth: number;
  paint?: number;
  bodyHealth: number;
  liveryId: number;
  isTemporary: boolean;
  admin?: true;
  mods: IVehicleMod[];
  extras: IVehicleExtra[];
  numberplate?: IVehicleNumberplate;
  rented?: true;
  rentAgencyId?: string;
  jobKey?: JobKey
  expiringAt?: Date;
  isSpawned: boolean;
  createdAt: Date;
  load?: number;
  updatedAt?: Date;
}


export interface IVehicleUpdateData {
  vehicleId: number;
  mileage: number;
  fuel: number;
}


export interface IVehicleOption {
  label: string;
  icon?: string;
  description?: string;
  eventKey: ProcedureKey;
}


export interface IVehicleSellOffer {
  vehicleId: string;
  targetId: number;
  price: number;
}
