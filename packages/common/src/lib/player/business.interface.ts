import { ObjectId } from 'mongoose';

export interface IProduct {
   name: string;
   quantity: number;
   price: number;
}

export interface Worker {
   character: string | ObjectId;
   job: string;
   hourlyWage: number;
}
