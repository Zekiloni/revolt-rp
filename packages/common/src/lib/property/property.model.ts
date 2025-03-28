import { Ref } from '@typegoose/typegoose';
import { CommercialType, PropertyPointType, PropertyType, PublicServiceType } from './property.enums';
import { Vector3 } from '../core.interface';
import { IOrganization } from '../organization/organization.model';
import { ICharacter } from '../player/character/character.model';
import { IDoor } from './door.model';
import { IVehicle } from '../vehicle/vehicle.model';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';


export interface IPropertyOwner {
  type: 'Character' | 'Organization';
  entity: Ref<ICharacter | IOrganization>;
}

export interface IWorker {
  character: Ref<ICharacter>;
  salary: number;
}

export interface IProduct {
  name: string;
  stock: number;
  price: number;
  discount?: number;
}

export interface IEntrance {
  fromPosition: Vector3;
  dimension: number;
  toPosition: Vector3;
  locked: boolean;
}

export interface IPropertyPoint {
  id: string;
  type: PropertyPointType;
  position: Vector3;
  rotation: Vector3;
  dimension: number;
}


export interface IPropertyCreate {
  name?: string;
  owner?: IPropertyOwner;
  type: PropertyType;
  subType?: CommercialType;
  price?: number;
  spriteType?: number;
}

export interface IPropertyUpdate {
  id: string;
  name?: string;
}

export interface IProperty extends Base {
  name?: string;
  owner?: IPropertyOwner;
  dimension: number;
  type: PropertyType;
  subType?: CommercialType | PublicServiceType;
  price?: number;
  spriteType?: number;
  forSale?: true;
  position: Vector3;
  interiorPosition: Vector3;
  balance: number;
  entrances?: IEntrance[];
  points: IPropertyPoint[];
  doors?: Ref<IDoor>[];
  locked: boolean;
  workers: IWorker[];
  catalog: IProduct[];
  vehicles: Ref<IVehicle>[];
}
