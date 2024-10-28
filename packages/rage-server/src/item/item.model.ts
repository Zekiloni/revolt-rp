// import { Document, Types } from 'mongoose';
// import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
// import { IItem, ItemSharedDataType } from '@bcrp-rage/common';
//
// @modelOptions({
//   schemaOptions: {
//     toObject: { virtuals: true },
//     toJSON: { virtuals: true }
//   }
// })
// export class Item extends Document implements IItem {
//   declare _id: Types.ObjectId;
//   declare id: string;
//
//   name: string;
//   quantity: number;
//
//   @prop({ type: Boolean, default: false })
//   dropped: boolean;
//
//   @prop({ required: false, type: Vector3 })
//   position?: Vector3;
//
//   @prop({ required: false, type: Vector3 })
//   rotation?: Vector3;
//
//   @prop({ required: false, type: Number })
//   dimension?: number;
//
//   @prop({ required: false, type: String })
//   serialNo?: string;
//
//   ammoInClip?: number;
//   buildProgress?: number;
//   durability: number;
//   expiringAt?: Date;
//   percentageOfDamage: number;
//   purity: number;
//
//   createdAt!: Date;
//
//   updatedAt?: Date;
//
//   set object(value: ObjectMp) {
//     value.setVariable(ItemSharedDataType.ItemId, this.id);
//   }
//
//   get object() {
//     return mp.objects.toArray()
//       .find(object => object.getVariable(ItemSharedDataType.ItemId) === this.id);
//   }
// }
//
//
// export const ItemModel = getModelForClass(Item);
