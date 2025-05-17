import { Ref } from '@typegoose/typegoose';
import { CommercialType, PropertyPointType, PropertyType, PublicServiceType } from './property.enums';
import { Vector3 } from '../core.interface';
import { IOrganization } from '../organization/organization.model';
import { ICharacter } from '../player/character/character.model';
import { IDoor } from './door.model';
import { IVehicle } from '../vehicle/vehicle.model';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { IBaseItem } from '../item/registry/base-item.model';

export interface IPropertyOwner {
  type: 'Character' | 'Organization';
  entity: Ref<ICharacter | IOrganization>;
}

export interface IProduct {
  id: string;
  name: string;
  stock: number;
  price: number;
  data: IBaseItem | null;
  discount?: number;
}

export interface IProductAdd {
  propertyId: string;
  name: string;
  price: number;
}

export interface IProductRemove {
  propertyId: string;
  product: IProduct;
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
  parentProperty?: Ref<IProperty>;
  price?: number;
  spriteType?: number;
}

export interface IPropertyUpdate {
  id: string;
  name?: string;
}


export interface IPropertyVehicle {
  id: string;
  model: string;
  limit: number;
  color?: [[number, number, number], [number, number, number]];
  liveryId?: number;
  bodyHealth?: number;
}

export interface IPropertyVehicleCreate {
  id: string;
  propertyId: string;
  model: string;
  limit: number;
  color?: [[number, number, number], [number, number, number]];
}

export interface IProperty extends Base {
  name?: string;
  owner?: IPropertyOwner;
  dimension: number;
  type: PropertyType;
  subType?: CommercialType | PublicServiceType;
  parentProperty?: Ref<IProperty>;
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
  catalog: IProduct[];
  vehicles: IPropertyVehicle[];
}
