import { Document, Types } from 'mongoose';
import { ISobrietyTest, SobrietyTestType } from '@revolt-rp/common';
import { modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { Character } from './character.model';

@modelOptions({
  schemaOptions: {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
})
export class SobrietyTest extends Document implements ISobrietyTest {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ ref: () => Character })
  target: Ref<Character>;

  @prop({ ref: () => Character })
  testedBy: Ref<Character>;

  @prop({ enum: Object.values(SobrietyTestType), type: () => String })
  type: SobrietyTestType;

  @prop({ required: true })
  result: boolean;

  @prop({ required: false })
  level?: number;

  @prop({ required: false })
  substances?: string[];

  @prop({ required: true })
  location: string;

  @prop({ required: false })
  note?: string;

  createdAt: Date;

  updatedAt?: Date;
}
