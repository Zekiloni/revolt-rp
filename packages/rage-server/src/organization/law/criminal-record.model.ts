import { Document, Types } from 'mongoose';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { ICharacter, ICharge, ICriminalRecord, RecordType } from '@revolt-rp/common';
import { Character } from '../../player/character/character.model';


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
    timestamps: true
  }
})
export class CriminalRecord extends Document implements ICriminalRecord {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ enum: RecordType, required: true })
  type: RecordType;

  @prop({ ref: () => Character })
  target?: Ref<ICharacter>;

  @prop({ ref: () => Character, required: true })
  officer: Ref<ICharacter>;

  @prop({ required: true })
  location: string;

  @prop({ type: () => [Charge], required: true })
  charges: Charge[];

  @prop()
  note?: string;

  @prop()
  numberplate?: string;

  @prop({ type: () => [String], default: [] })
  evidences?: string[];

  @prop()
  createdAt: Date;

  @prop()
  updatedAt?: Date;
}

export const CriminalRecordModel = getModelForClass(CriminalRecord);
