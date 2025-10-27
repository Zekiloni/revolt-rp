import { Types } from 'mongoose';
import { modelOptions, prop } from '@typegoose/typegoose';
import { IProduct } from '@revolt-rp/common';


@modelOptions({
  schemaOptions: { toObject: { getters: true }, toJSON: { getters: true } }
})
export class Product implements IProduct {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  price: number;

  @prop({ required: false, default: 0 })
  stock: number;

  @prop({ required: false })
  discount?: number;

  @prop({ required: false, default: 0 })
  ordered: number;
}
