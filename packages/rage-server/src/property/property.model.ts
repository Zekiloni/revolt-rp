import { Document, Types } from 'mongoose';
import {
  CommercialType, IDoor,
  IEntrance,
  IProduct,
  IProperty,
  IPropertyOwner,
  IPropertyPoint, IWorker,
  PropertyType
} from '@revolt-rp/common';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';


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

  @prop({ enum: Object.values(CommercialType), type: String, required: false })
  subType: CommercialType;

  @prop({ default: 0 })
  balance: number;

  @prop({ required: true })
  dimension: number;

  doors: Ref<IDoor>[];
  entrances: IEntrance[];
  forSale: true;
  interiorPosition: Vector3;
  locked: boolean;
  name: string;
  owner: IPropertyOwner;
  points: IPropertyPoint[];
  position: Vector3;
  price: number;
  spriteType: number;

  products: IProduct[];
  workers: IWorker[];

  createdAt: Date;
  updatedAt?: Date;
}

export const PropertyModel = getModelForClass(Property);
