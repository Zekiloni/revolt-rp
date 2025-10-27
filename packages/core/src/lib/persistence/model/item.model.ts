import { Document, Types } from 'mongoose';
import { modelOptions, prop } from '@typegoose/typegoose';
import {
  IBankCardInfo, IBaseItem,
  IDocumentInfo,
  IHandheldRadioConfig,
  IItem,
  IPhoneInfo,
  ItemFlag,
  IVector3,
  IWearableInfo
} from '@revolt-rp/common';


@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
})
export class Item extends Document implements IItem {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true, type: String })
  name: string;

  @prop({ required: false, type: Number, default: 1 })
  quantity: number;

  @prop({ required: false, type: Number })
  localSlot: number;

  @prop({ type: Boolean, default: false })
  dropped: boolean;

  @prop({ required: false, type: Object })
  position?: IVector3;

  @prop({ required: false, type: Object })
  rotation?: IVector3;

  @prop({ required: false, type: Number })
  dimension?: number;

  @prop({ required: false, type: String })
  serialNo?: string;

  @prop({ type: Number, required: false })
  weaponAmmo?: number;

  @prop({ type: Number, required: false })
  buildProgress?: number;

  @prop({ default: 100 })
  usage: number;

  @prop({ type: Object, required: false })
  bankCardInfo?: IBankCardInfo;

  @prop({ type: Date, required: false })
  expiringAt?: Date;

  @prop({ type: Number, required: false })
  purity?: number;

  @prop({ type: Boolean, required: false })
  equipped?: boolean;

  @prop({ type: Object, required: false })
  wearableInfo?: IWearableInfo;

  @prop({ type: Object, required: false })
  radioConfig?: IHandheldRadioConfig;

  @prop({ type: Object, required: false })
  phoneInfo?: IPhoneInfo;

  @prop({ type: Object, required: false })
  documentInfo?: IDocumentInfo;

  @prop({ enum: ItemFlag, type: String, required: false })
  flag?: ItemFlag;

  createdAt!: Date;
  updatedAt?: Date;

  data?: IBaseItem;
}

