import { Document, Types } from 'mongoose';
import { IWarrant } from '@revolt-rp/common';
import { modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { Character } from './character.model';

@modelOptions({
  schemaOptions: {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  }
})
export class Warrant extends Document implements IWarrant {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ ref: () =>  Character })
  target: Ref<Character>;

  @prop({ ref: () =>  Character })
  issuedBy: Ref<Character>;

  @prop({ required: true })
  reason: string;

  @prop({ required: false })
  charges: string[];

  @prop({ required: false })
  expiringAt?: Date;

  @prop({required: true})
  isActive: boolean;

  createdAt: Date;

  updatedAt?: Date;
}
