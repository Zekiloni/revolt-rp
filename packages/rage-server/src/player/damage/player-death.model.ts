import { Ref, modelOptions, prop, getModelForClass } from '@typegoose/typegoose';
import { IPlayerDeath } from '@revolt-rp/common';
import { Types } from 'mongoose';
import { Character } from '../character/character.model';


@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
  options: {
    customName: 'player_deaths',
  }
})
export class PlayerDeath implements IPlayerDeath {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ ref: () => Character, required: true })
  target: Ref<Character>;

  @prop({ required: true })
  reason: number;

  @prop({ required: true, default: 'unknown' })
  cause: string;

  @prop({ required: true, default: false })
  giveUp: boolean;

  @prop({ ref: () => Character, required: false })
  killer?: Ref<Character>;

  createdAt: Date;
  updatedAt?: Date;
}

export const PlayerDeathModel = getModelForClass(PlayerDeath)
