import { Document, Types } from 'mongoose';
import { IEquipment, ILocker, IOrganization, IVector3, OrganizationType } from '@revolt-rp/common';
import { modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { OrganizationRank } from './organization-rank.model';

export class Equipment implements IEquipment {
  @prop({ required: true })
  name: string;

  @prop({ type: Number, required: true })
  quantity: number;

  @prop({ type: Number, required: true })
  limit: number;
}

export class Locker implements ILocker {
  @prop({ required: true })
  name: string;

  @prop({ type: Object, required: true })
  position: IVector3;

  @prop({ type: Number, required: true })
  dimension: number;

  @prop({ type: [Equipment], default: [] })
  equipments: Equipment[];
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
})
export class Organization extends Document implements IOrganization {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true, unique: true })
  shortName: string;

  @prop({ required: true, enum: Object.values(OrganizationType), type: String })
  type: OrganizationType;

  @prop({ required: true })
  color: string;

  @prop({ type: Object, required: true })
  position: IVector3;

  @prop({ type: Number, required: true })
  dimension: number;

  @prop({ type: Number, required: true })
  heading: number;

  @prop({ ref: () => Organization, required: false })
  parentOrganization?: Ref<Organization>;

  @prop({ type: Number, default: 0 })
  balance: number;

  @prop({ type: [Locker], default: [] })
  lockers: Locker[];

  @prop({ ref: () => OrganizationRank, default: [] })
  ranks: Ref<OrganizationRank>[];

  @prop({ type: Number, required: false })
  importLimit?: number;

  createdAt: Date;
  updatedAt?: Date;
}
