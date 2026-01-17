import { Document, Types } from 'mongoose';
import { IPhoneMessage, PhoneMessageType } from '@revolt-rp/common';
import { modelOptions, prop } from '@typegoose/typegoose';


@modelOptions({
  options: {
    customName: 'phone_messages'
  },
  schemaOptions: {
    timestamps: {
      createdAt: true
    },
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
})
export class PhoneMessage extends Document implements IPhoneMessage {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true })
  content: string;

  @prop({ type: String, enum: Object.values(PhoneMessageType), required: true })
  type: PhoneMessageType;

  @prop({ type: String, required: true })
  sender: string;

  @prop({ type: String, required: true })
  receiver: string;

  @prop({ default: false })
  seen: boolean;

  createdAt: Date;
}

