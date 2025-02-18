import { Types, Document } from 'mongoose';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IOrganizationRank, OrganizationPermissionType } from '@revolt-rp/common';


@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
})
export class OrganizationRank extends Document implements IOrganizationRank {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  salary: number;

  @prop({ required: true, enum: Object.values(OrganizationPermissionType), type: String })
  permission: OrganizationPermissionType;

  createdAt: Date;
  updatedAt?: Date;
}


export const OrganizationRankModel = getModelForClass(OrganizationRank);
