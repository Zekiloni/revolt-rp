import { Document, Types } from 'mongoose';
import { IOrganization, IOrganizationRank, OrganizationType } from '@revolt-rp/common';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';


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
  position: Vector3;

  @prop({ type: Number, required: true })
  dimension: number;

  @prop({ type: Number, required: true })
  heading: number;

  @prop({ ref: () => Organization, required: false })
  parentOrganization?: Ref<Organization>;

  ranks: Ref<IOrganizationRank>[];

  @prop({ type: Number, required: false })
  importLimit?: number;

  createdAt: Date;
  updatedAt?: Date;
}

export const OrganizationModel = getModelForClass(Organization);
