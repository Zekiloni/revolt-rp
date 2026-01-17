import { Document, Types } from 'mongoose';
import { IGangRecord } from '@revolt-rp/common';
import { modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { Character } from './character.model';

@modelOptions({
  schemaOptions: {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
})
export class GangRecord extends Document implements IGangRecord {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  location: string;

  @prop({ required: true })
  name: string;

  @prop({ required: false })
  note?: string;

  @prop({ ref: () => Character })
  officer: Ref<Character>;

  createdAt: Date;

  updatedAt?: Date;
}
