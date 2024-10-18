import { Prop, prop, Ref } from '@typegoose/typegoose';
import { CharacterGender, CharacterSpawnType } from './character.enums';
import { characterConfig } from './character.config';
import { Account } from '../account/account.model';
import { Vector3 } from '../../core.interface';

export interface HeadBlendData {
  headBlendData: {
    shapeFirstId: number,
    shapeSecondId: number,
    shapeThirdId: number,
    skinFirstId: number,
    skinSecondId: number,
    skinThirdId: number,
    shapeMix: number,
    skinMix: number,
    thirdMix: number,
    isParent: boolean
  };
}

export interface FaceFeature {
  faceFeature: [
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number
  ];
}

export interface CharacterAppearance extends HeadBlendData, FaceFeature {
  eyeColor: number;
  hairStyle: number;
  hairColor: number;
  hairHighlightColor: number;
}

export interface CharacterSpawn {
  type: CharacterSpawnType;
  propertyId?: string;
}

export class Character {
  id!: string;

  @prop({ ref: () => Account, type: () => String })
  account!: Ref<(Account)>;

  firstName: string;

  lastName: string;

  birthday!: Date;

  appearance!: CharacterAppearance;

  @Prop({
    default: () => ({ type: CharacterSpawnType.LAST_POSITION })
  })
  defaultSpawn!: CharacterSpawn;

  @Prop(({ type: String }))
  gender!: CharacterGender;

  @prop({ default: [] })
  inventory!: { item: string; localSlot: number }[];

  @prop({ default: characterConfig.DEFAULT_MAX_PROPERTIES })
  maxProperties!: number;

  @prop({ default: characterConfig.DEFAULT_MAX_VEHICLES })
  maxVehicles!: number;

  position!: Vector3;
}
