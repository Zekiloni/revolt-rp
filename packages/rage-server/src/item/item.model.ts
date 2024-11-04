import { Document, Types } from 'mongoose';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IItem, ItemFlag, ItemSharedDataType } from '@bcrp-rage/common';
import { itemRegistry } from './registry/base-item.model';

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
  position?: Vector3;

  @prop({ required: false, type: Object })
  rotation?: Vector3;

  @prop({ required: false, type: Number })
  dimension?: number;

  @prop({ required: false, type: String })
  serialNo?: string;

  ammoInClip?: number;

  buildProgress?: number;

  usability: number;
  durability: number;

  expiringAt?: Date;

  percentageOfDamage: number;

  purity?: number;

  flag?: ItemFlag;

  createdAt!: Date;

  updatedAt?: Date;

  get data() {
    return itemRegistry.get(this.name);
  }

  set object(value: ObjectMp) {
    value.setVariable(ItemSharedDataType.ItemId, this.id);
  }

  get object() {
    return mp.objects.toArray()
      .find(object => object.getVariable(ItemSharedDataType.ItemId) === this.id);
  }
}


export const ItemModel = getModelForClass(Item);
