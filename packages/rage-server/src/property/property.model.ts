import { Document, Types } from 'mongoose';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import {
  CommercialType, IDoor,
  IEntrance,
  IProduct,
  IProperty,
  IPropertyOwner,
  IPropertyPoint, IWorker, PropertySharedDataType,
  PropertyType
} from '@revolt-rp/common';
import { Organization } from '../organization/organization.model';
import { Character } from '../player/character/character.model';


export class PropertyOwner implements IPropertyOwner {
  @prop({ type: String, enum: ['Character', 'Organization'], required: true })
  type: 'Character' | 'Organization';

  @prop({ refPath: 'owner.type' })
  entity: Ref<Character | Organization>;
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

  @prop({ enum: Object.values(CommercialType), type: String, required: false })
  subType: CommercialType;

  @prop({ default: 0 })
  balance: number;

  @prop({ type: Object, required: true })
  position: Vector3;

  @prop({ required: true })
  dimension: number;

  doors: Ref<IDoor>[];
  entrances: IEntrance[];

  @prop({ default: false })
  forSale: true;

  interiorPosition: Vector3;

  @prop({ default: false })
  locked: boolean;

  @prop({ required: false })
  name: string;

  @prop({ type: PropertyOwner })
  owner: PropertyOwner;

  points: IPropertyPoint[];

  @prop({ required: false })
  price: number;

  @prop({ required: false })
  spriteType?: number;

  products: IProduct[];
  workers: IWorker[];

  createdAt: Date;
  updatedAt?: Date;

  set colShape(value: ColshapeMp) {
    value.setVariable(PropertySharedDataType.PropertyId, this.id);
  }

  get colShape() {
    return mp.colshapes.toArray()
      .find(colShape => colShape.getVariable(PropertySharedDataType.PropertyId) === this.id);
  }

  set marker(value: MarkerMp) {
    value.setVariable(PropertySharedDataType.PropertyId, this.id);
  }

  get marker() {
    return mp.markers.toArray()
      .find(marker => marker.getVariable(PropertySharedDataType.PropertyId) === this.id);
  }
}

export const PropertyModel = getModelForClass(Property);
