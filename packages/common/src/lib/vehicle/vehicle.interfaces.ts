import { ObjectId } from 'mongoose';
import { Vector3 } from '../core.interface';

export interface IVehicleMod {
   type: number;
   index: number;
}

export interface  IVehicleNumberplate {
   numberplate: string;
   type: number;
   expiringAt: Date;
}

export interface Vehicle {
   id: string | ObjectId;
   vehicleModel: string;
   owner?: string | ObjectId;
   fuel: number;
   price: number | undefined;
   locked: boolean;
   position: Vector3;
   rotation: Vector3;
   mileage: number;
   mods: IVehicleMod[];
   numberplate?: IVehicleNumberplate
}
