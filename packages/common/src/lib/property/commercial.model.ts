import { IProduct } from './property.model';
import { IWearableItem } from '../item/registry/wearable-item.model';


export enum PaymentType {
  Cash = 'cash',
  BankCard = 'bank_card',
}


export interface IPayment {
  type: PaymentType;
  bankAccountNo?: string;
}

export interface IVehicleRent {
  propertyId: string;
  model: string;
  duration: number;
  payment: IPayment;
}

export interface IDealershipCheckout {
  propertyId: string;
  vehicle: IProduct;
  payment: IPayment;
}

export interface ICartItem<T> {
  product: T;
  quantity: number;
}

export interface IShopping<T> {
  propertyId: string;
  shoppingCart: ICartItem<T>[];
  payment: IPayment;
}


export interface IClothingProduct extends IProduct {
  data: IWearableItem
}


export type IClothingCartItem = ICartItem<IClothingProduct> & {
  drawable: number;
  texture: number;
}
