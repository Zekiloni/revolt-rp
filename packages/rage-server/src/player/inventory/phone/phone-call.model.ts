import { Document, Types } from 'mongoose';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IPhoneCall, PhoneCallStatus } from '@revolt-rp/common';


@modelOptions({
  options: {
    customName: 'phone_calls'
  },
  schemaOptions: {
    timestamps: {
      createdAt: true
    }
  }
})
export class PhoneCall extends Document implements IPhoneCall {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ type: String, required: true })
  caller: string;

  @prop({ type: String, required: true })
  receiver: string;

  @prop({ enum: Object.values(PhoneCallStatus), type: String, default: PhoneCallStatus.Dialing })
  status: PhoneCallStatus;

  createdAt: Date;
}


export const PhoneCallModel = getModelForClass(PhoneCall);
