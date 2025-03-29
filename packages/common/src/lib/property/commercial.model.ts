


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

export interface IShoppingCart<T> {
  product: T;
  quantity: number;
}

export interface IGroceryBuy<T> {
  propertyId: string;
  shoppingCart: IShoppingCart<T>[];
  payment: IPayment;
}
