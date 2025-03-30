


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

export interface ICartItem<T> {
  product: T;
  quantity: number;
}

export interface IShopping<T> {
  propertyId: string;
  shoppingCart: ICartItem<T>[];
  payment: IPayment;
}
