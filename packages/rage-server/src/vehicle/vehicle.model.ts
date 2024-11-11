// import { Document, Types } from 'mongoose';
// import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
// import { IVehicle, IVehicleExtra, IVehicleMod, IVehicleNumberplate } from '@bcrp-rage/common';
// import { Character } from '../player/character/character.model';
// import { vehicleConfig } from './vehicle.config';
//
// @modelOptions({
//   schemaOptions: {
//     toObject: { virtuals: true },
//     toJSON: { virtuals: true }
//   }
// })
// export class Vehicle extends Document implements IVehicle {
//   declare _id: Types.ObjectId;
//   declare id: string;
//
//   isTemporary: true;
//
//   @prop({ type: String, required: true })
//   model: string;
//
//   @prop({ type: [[Number]], required: true })
//   color: [[number, number, number], [number, number, number]];
//
//   @prop({ type: Number, required: false })
//   price?: number;
//
//   @prop({ type: Object, required: true })
//   position: Vector3;
//
//   @prop({ type: Object, required: true })
//   rotation: Vector3;
//
//   @prop({ type: Number, default: vehicleConfig.defaultDimension })
//   dimension: number;
//
//   @prop({ type: Boolean, default: false })
//   engine: boolean;
//
//   @prop({ type: Boolean, default: false })
//   locked: boolean;
//
//   @prop({ type: Number, default: vehicleConfig.defaultFuel })
//   fuel: number;
//
//   @prop({ type: Number, default: 0.0 })
//   mileage: number;
//
//   bodyHealth: number;
//   engineHealth: number;
//
//   @prop({ type: [Object], default: [] })
//   extras: IVehicleExtra[];
//
//   paint: number;
//   wheelType: number;
//   windowTint: number;
//   wheelColor: number;
//   dashboardColor: number;
//   pearlescentColor: number;
//   trimColor: number;
//   neonColor: number;
//
//   @prop({ type: Number, default: vehicleConfig.defaultLivery })
//   liveryId: number;
//
//   @prop({ type: [Object], default: [] })
//   mods: IVehicleMod[];
//
//   @prop({ type: Object })
//   numberplate?: IVehicleNumberplate;
//
//   @prop({ ref: () => Character })
//   owner: Ref<Character>;
//
//   createdAt!: Date;
//
//   updatedAt?: Date;
// }
//
//
// export const VehicleModel = getModelForClass(Vehicle);
