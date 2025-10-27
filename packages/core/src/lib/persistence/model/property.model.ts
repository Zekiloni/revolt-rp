import { Document, Types } from 'mongoose';
import { modelOptions, prop, type Ref } from '@typegoose/typegoose';
import {
  CommercialType,
  IDoor,
  IEntrance,
  IProperty,
  IPropertyOwner,
  IPropertyPoint,
  IPropertyVehicle,
  IVector3,
  PropertyPointType,
  PropertyType,
  PublicServiceType,
  UtilityType
} from '@revolt-rp/common';
import { Organization } from './organization.model';
import { Character } from './character.model';
import { Product } from './product.model';


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

  @prop({ type: Object, required: true })
  rotation: IVector3;

  @prop({ required: true })
  dimension: number;

  constructor(init: IPropertyPoint) {
    Object.assign(this, init);
  }
}

export class Door implements IDoor {
  id?: number;
  objectId: number;
  hashes?: number[];
  position: IVector3[];
  dimension: number;
  locked: boolean;
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

  doors: Ref<Door>[];
  entrances: IEntrance[];

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

  createdAt: Date;
  updatedAt?: Date;
}

