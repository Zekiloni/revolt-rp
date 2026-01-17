import { Document, Types } from 'mongoose';
import { modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { AdvertisementCategory, IAdvertisement } from '@revolt-rp/common';
import { Character } from './character.model';


@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true
    },
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
})
export class Advertisement extends Document implements IAdvertisement {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ ref: () => Character, required: true })
  author: Ref<Character>;

  @prop({ type: String, required: true, enum: Object.values(AdvertisementCategory) })
  category: AdvertisementCategory;

  @prop({ type: String, required: true })
  content: string;

  @prop({ type: Boolean, default: false })
  public: boolean;

  @prop({ type: String, required: true })
  phoneNumber: string;

  @prop({ type: Number, required: false })
  price: number | null;

  @prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';

  createdAt: Date;
}

