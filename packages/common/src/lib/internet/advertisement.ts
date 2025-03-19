import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ICharacter } from '../player/character/character.model';



export enum AdvertisementCategory {
  Properties = 'properties',
  Vehicles = 'vehicles',
  Electronics = 'electronics',
  Clothing = 'clothing',
  Furniture = 'furniture',
  Other = 'other',
}


export interface IAdvertisementCreate {
  public: boolean;
  category: AdvertisementCategory;
  content: string;
  price: number | null;
}

export interface IAdvertisement extends Base {
  author: Ref<ICharacter>;
  public: boolean;
  status: 'active' | 'inactive';
  category: AdvertisementCategory;
  content: string;
  phoneNumber: string;
  price: number | null;
  createdAt: Date;
}
