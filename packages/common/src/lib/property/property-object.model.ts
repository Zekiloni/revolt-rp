import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref } from '@typegoose/typegoose';
import { IVector3 } from '../core.interface';
import { IItem } from '../item/item.model';
import { IProperty } from './property.model';


export const isPopulated = <T>(ref: Ref<T> | undefined | null, field: string): ref is T => {
  return ref !== null && ref !== undefined && typeof ref === 'object' && field in ref;
};


export enum ObjectType {
  Door = 'door',
  Furniture = 'furniture',
  Static = 'static'
}

export interface IBaseObject extends Base {
  type: ObjectType

  position: IVector3;
  rotation: IVector3;
  dimension: number;
  property: Ref<IProperty>;

  createdAt: Date;
  updatedAt?: Date;
}

export interface IStaticObject extends IBaseObject {
  type: ObjectType.Static;
  model: string;
}

export interface IDoorObject extends IBaseObject {
  type: ObjectType.Door;
  native: boolean;
  locked: boolean;
  model?: string;
  hash?: number;
  parent?: Ref<IDoorObject>;
}

export interface IFurnitureObject extends IBaseObject {
  type: ObjectType.Furniture;
  model: string;
  items?: Ref<IItem>[];
}
