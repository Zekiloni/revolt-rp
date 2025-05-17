import { Document, Types } from 'mongoose';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import {
  CommercialType, IDoor,
  IEntrance,
  IProperty,
  IPropertyOwner,
  IPropertyPoint, IPropertyVehicle, propertyJobMap, PropertyPointType, PropertySharedDataType,
  PropertyType, PublicServiceType, UtilityType
} from '@revolt-rp/common';
import { Organization } from '../organization/organization.model';
import { Character } from '../player/character/character.model';
import { Product } from './catalog/product.model';
import { getJob } from '../job/base-job.service';


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
  position: Vector3;

  @prop({ type: Object, required: true })
  rotation: Vector3;

  @prop({ required: true })
  dimension: number;
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
    enum: [...Object.values(CommercialType), ...Object.values(PublicServiceType), ...Object.values(UtilityType)],
    type: String,
    required: false
  })
  subType: CommercialType | PublicServiceType;

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

  @prop({ type: [PropertyPoint], required: false, default: [] })
  points: IPropertyPoint[];

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

  get job() {
    const jobKey = propertyJobMap[this.subType];
    return jobKey ? getJob(jobKey) : undefined;
  }
}

