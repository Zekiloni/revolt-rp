import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ICharacter } from '../player/character/character.model';

export enum AdvertisementType {
  BUY = 'buy',
  SELL = 'sell',
  TRADE = 'trade',
}

export enum AdvertisementCategory {
  Property = 'property',
  Vehicle = 'vehicle',
  Electronics = 'electronics',
  Clothing = 'clothing',
  Furniture = 'furniture',
  Other = 'other',
}


export enum AdvertisementStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface Advertisement extends Base {
  author: Ref<ICharacter>;
  type: AdvertisementType;
  status: AdvertisementStatus;
  category: AdvertisementCategory;
  content: string;
  phoneNum: string;
  price?: number;
  createdAt: Date;
}
