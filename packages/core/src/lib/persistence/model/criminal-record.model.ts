import { Document, Types } from 'mongoose';
import { modelOptions, prop, type  Ref } from '@typegoose/typegoose';
import { ICharge, ICriminalRecord, RecordType } from '@revolt-rp/common';
import { Character } from './character.model';
import { Property } from './property.model';


export class Charge implements ICharge {
  @prop({ required: true })
  code: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  fine: number;

  @prop({ required: true })
  jailTime: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  }
})
export class CriminalRecord extends Document implements ICriminalRecord {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ enum: Object.values(RecordType), type: () => String, required: true })
  type: RecordType;

  @prop({ ref: () => Character })
  target?: Ref<Character>;

  @prop({ ref: () => Character, required: true })
  officer: Ref<Character>;

  @prop({ required: true })
  location: string;

  @prop({ type: () => [Charge], required: true })
  charges: Charge[];

  @prop()
  note?: string;

  @prop()
  numberplate?: string;

  @prop({ type: Boolean, default: false })
  released?: boolean;

  @prop({ type: () => [String], default: [] })
  evidences?: string[];

  @prop({ ref: () => Property, default: null })
  prisonProperty: Ref<Property>

  @prop()
  createdAt: Date;

  @prop({ type: Date, default: null })
  expiringAt?: Date;

  @prop()
  updatedAt?: Date;
}

