import { Document, Types } from 'mongoose';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { IVehicle, IVehicleExtra, IVehicleMod, IVehicleNumberplate } from '@revolt-rp/common';
import { Character } from '../player/character/character.model';
import { vehicleConfig } from './vehicle.config';
import { Item } from '../item/item.model';
import { Organization } from '../organization/organization.model';


@modelOptions({
  schemaOptions: {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
})
export class Vehicle extends Document implements IVehicle {
  declare _id: Types.ObjectId;
  declare id: string;

  @prop({ required: true, default: false })
  isTemporary: boolean;

  @prop({ type: String, required: true })
  model: string;

  @prop({ type: [[Number]], required: true })
  color: [[number, number, number], [number, number, number]];

  @prop({ type: Number, required: false })
  price?: number;

  @prop({ type: Object, required: true })
  position: Vector3;

  @prop({ type: Object, required: true })
  rotation: Vector3;

  @prop({ type: Number, default: vehicleConfig.defaultDimension })
  dimension: number;

  @prop({ type: Boolean, default: false })
  engine: boolean;

  @prop({ type: Boolean, default: false })
  locked: boolean;

  @prop({ type: Number, default: vehicleConfig.defaultFuel })
  fuel: number;

  @prop({ type: Number, default: 0.0 })
  mileage: number;

  bodyHealth: number;
  engineHealth: number;

  @prop({ ref: () => Item, default: [] })
  trunk: Ref<Item>[];

  @prop({ type: [Object], default: [] })
  extras: IVehicleExtra[];

  paint: number;
  wheelType: number;
  windowTint: number;
  wheelColor: number;
  dashboardColor: number;
  pearlescentColor: number;
  trimColor: number;
  neonColor: number;

  @prop({ type: Number, default: vehicleConfig.defaultLivery })
  liveryId: number;

  @prop({ type: [Object], default: [] })
  mods: IVehicleMod[];

  @prop({ type: Boolean, required: false })
  rented?: true;

  @prop({ required: false })
  rentAgencyId?: string;

  @prop({ type: Date, required: false })
  expiringAt?: Date;

  @prop({ type: Object, required: false })
  numberplate?: IVehicleNumberplate;

  @prop({ ref: () => Character, required: false })
  owner?: Ref<Character>;

  @prop({ ref: () => Organization })
  organization?: Ref<Organization>;

  @prop({ type: Boolean, required: false, default: true })
  isSpawned: boolean;

  createdAt!: Date;
  updatedAt?: Date;

  load?: number;
}


