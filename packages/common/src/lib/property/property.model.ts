import { Ref } from '@typegoose/typegoose';
import { BusinessType, PropertyType } from './property.enums';
import { Vector3 } from '../core.interface';
import { IOrganization } from '../organization/organization.model';
import { ICharacter } from '../player/character/character.model';
import { IDoor } from './door.model';


export interface IPropertyOwner {
  type: 'character' | 'organization';
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
  type: 'interaction' | 'delivery' | 'vehicle-spawn';
  position: Vector3;
  dimension: number;
}


export interface IProperty {
  id: string;
  name?: string;
  owner?: IPropertyOwner;
  dimension: number;
  type: PropertyType;
  subType?: BusinessType;
  price?: number;
  spriteType?: number;
  forSale?: true;
  position: Vector3;
  interiorPosition: Vector3;
  balance: number;
  entrances?: IEntrance[];
  points?: IPropertyPoint[];
  doors?: Ref<IDoor>[];
  locked: boolean;
  workers: IWorker[];
  products: IProduct[];
}
