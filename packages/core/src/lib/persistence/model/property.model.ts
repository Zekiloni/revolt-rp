import { Document, Types } from 'mongoose';
import { modelOptions, prop, type Ref } from '@typegoose/typegoose';
import {
  CommercialType, IBaseObject,
  IEntrance,
  IProperty,
  IPropertyOwner,
  IPropertyPoint,
  IPropertyVehicle,
  IVector3, ObjectType,
  PropertyPointType,
  PropertyType,
  PublicServiceType,
  UtilityType
} from '@revolt-rp/common';
import { Organization } from './organization.model';
import { Character } from './character.model';
import { Product } from './product.model';
import { Item } from '@revolt-rp/core';


const propertySubTypeEnum: (CommercialType | PublicServiceType | UtilityType)[] = [
  ...Object.values(CommercialType),
  ...Object.values(PublicServiceType),
  ...Object.values(UtilityType)
];

export class PropertyOwner implements IPropertyOwner {
  @prop({ type: String, enum: ['Character', 'Organization'], required: true })
  type: 'Character' | 'Organization';

  @prop({ refPath: 'owner.type' })
  entity: Ref<Character | Organization>;
}

export class PropertyPoint implements IPropertyPoint {
  @prop({ type: String, required: true })
  id: string;

  @prop({ type: String, enum: Object.values(PropertyPointType), required: true })
  type: PropertyPointType;

  @prop({ type: Object, required: true })
  position: IVector3;

  @prop({ type: String, required: false })
  description?: string;

  @prop({ type: Object, required: true })
  rotation: IVector3;

  @prop({ required: true })
  dimension: number;

  constructor(init: IPropertyPoint) {
    Object.assign(this, init);
  }
}

export class PropertyVehicle implements IPropertyVehicle {
  @prop({ type: String, required: true })
  id: string;

  @prop({ type: String, required: true })
  model: string;

  @prop({ type: String, required: true })
  limit: number;

  @prop({ required: false })
  color?: [[number, number, number], [number, number, number]];

  @prop({ required: false })
  liveryId?: number;

  @prop({ required: false })
  bodyHealth?: number;
}


@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
})
export class Property extends Document implements IProperty {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ enum: Object.values(PropertyType), type: String, required: true })
  type: PropertyType;

  @prop({
    enum: propertySubTypeEnum,
    type: String,
    required: false
  })
  subType: CommercialType | PublicServiceType;

  @prop({ default: 0 })
  balance: number;

  @prop({ type: Object, required: true })
  position: IVector3;

  @prop({ required: true })
  dimension: number;

  entrances: IEntrance[];

  @prop({ required: false })
  address?: string;

  @prop({ default: false })
  forSale: true;

  interiorPosition: IVector3;

  @prop({ default: false })
  locked: boolean;

  @prop({ required: false })
  name: string;

  @prop({ type: PropertyOwner })
  owner: PropertyOwner;

  @prop({ type: [PropertyPoint], required: false, default: [] })
  points: PropertyPoint[];

  @prop({ required: false })
  price: number;

  @prop({ required: false })
  spriteType?: number;

  @prop({ type: [PropertyVehicle], default: [] })
  vehicles: IPropertyVehicle[];

  @prop({ type: [Product], default: [] })
  catalog: Product[];

  @prop({ ref: () => Property, required: false })
  parentProperty?: Ref<Property>;

  @prop({ ref: () => PropertyObject, default: [] })
  objects: Ref<PropertyObject>[];

  createdAt: Date;
  updatedAt?: Date;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    discriminatorKey: 'type'
  }
})
export class PropertyObject extends Document implements IBaseObject {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ enum: Object.values(ObjectType), required: true })
  type: ObjectType;

  @prop({ type: Object, required: true })
  declare position: IVector3;

  declare rotation: IVector3;

  @prop({ required: true })
  dimension: number;

  createdAt: Date;
  updatedAt?: Date;
}

export class FurnitureObject extends PropertyObject {
  @prop({ required: true })
  model: string;

  @prop({ type: Object, required: true })
  declare rotation: IVector3;

  @prop({ ref:'Item', default: [] })
  items: Ref<Item>[];
}

export class DoorObject extends PropertyObject {
  @prop({ required: true })
  locked: boolean;

  @prop({ required: true })
  native: boolean;

  @prop({ required: false })
  hash?: number;

  @prop({ required: false })
  model?: string;

  @prop({ type: Object, required: true })
  declare rotation: IVector3;

  // @prop({ ref: () => DoorObject, required: false })
  // parent?: Ref<DoorObject>;
}

export class StaticObject extends PropertyObject {
  @prop({ required: true })
  model: string;

  @prop({ type: Object, required: true })
  declare rotation: IVector3;
}
