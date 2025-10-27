import { Ref } from '@typegoose/typegoose';
import { CommercialType, PropertyPointType, PropertyType, PublicServiceType } from './property.enums';
import { IVector3 } from '../core.interface';
import { IOrganization } from '../organization/organization.model';
import { ICharacter } from '../player/character/character.model';
import { IDoor } from './door.model';
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
  ordered: number;
  data?: IBaseItem | null;
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

export interface IProductUpdate {
  propertyId: string;
  product: IProduct;
}

export interface IEntrance {
  fromPosition: IVector3;
  dimension: number;
  toPosition: IVector3;
  locked: boolean;
}

export interface IPropertyPoint {
  id: string;
  type: PropertyPointType;
  position: IVector3;
  rotation: IVector3;
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
  position: IVector3;
  interiorPosition: IVector3;
  balance: number;
  entrances?: IEntrance[];
  points: IPropertyPoint[];
  doors?: Ref<IDoor>[];
  locked: boolean;
  catalog: IProduct[];
  vehicles: IPropertyVehicle[];
}
