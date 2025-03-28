


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
