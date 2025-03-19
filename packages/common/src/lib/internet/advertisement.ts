import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ICharacter } from '../player/character/character.model';


export enum AdvertisementType {
  Buy = 'buy',
  Sell = 'sell',
  Trade = 'trade',
}

export enum AdvertisementCategory {
  Property = 'property',
  Vehicle = 'vehicle',
  Electronics = 'electronics',
  Clothing = 'clothing',
  Furniture = 'furniture',
  Other = 'other',
}


export interface IAdvertisementCreate {
  type: AdvertisementType;
  public: boolean;
  category: AdvertisementCategory;
  content: string;
  price?: number;
}

export interface IAdvertisement extends Base {
  author: Ref<ICharacter>;
  type: AdvertisementType;
  public: boolean;
  status: 'active' | 'inactive';
  category: AdvertisementCategory;
  content: string;
  phoneNumber: string;
  price?: number;
  createdAt: Date;
}
