import { Document, Types } from 'mongoose';
import { modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { IVector3, IVehicle, IVehicleExtra, IVehicleMod, IVehicleNumberplate, JobKey } from '@revolt-rp/common';
import { Organization } from './organization.model';
import { Character } from './character.model';
import { Item } from './item.model';
import { vehicleConfig } from '../../config/vehicle.config';


export class VehicleNumberplate implements IVehicleNumberplate {
  @prop({ type: String, required: true })
  text: string;

  @prop({ type: String, required: true })
  style: string;

  @prop({ type: String, required: true })
  content: string;

  @prop({ type: Date, required: true })
  expiringAt: Date;

  @prop({ type: Number, required: true })
  modelType: number;

  @prop({ type: String, required: true })
  vehicleId: string;

  constructor(numberplate: IVehicleNumberplate) {
    Object.assign(this, numberplate);
  }
}

export class VehicleExtra implements IVehicleExtra {
  @prop({ type: Number, required: true })
  extraId: number;

  @prop({ type: Boolean, required: true })
  enabled: boolean;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
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
  position: IVector3;

  @prop({ type: Object, required: true })
  rotation: IVector3;

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

  @prop({ type: [VehicleExtra], default: [] })
  extras: VehicleExtra[];

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

  @prop({ type: VehicleNumberplate, required: false })
  numberplate?: VehicleNumberplate;

  @prop({ ref: () => Character, required: false })
  owner?: Ref<Character>;

  @prop({ ref: () => Organization })
  organization?: Ref<Organization>;

  @prop({ type: Boolean, required: false, default: true })
  isSpawned: boolean;

  createdAt!: Date;
  updatedAt?: Date;

  load?: number;
  admin?: true;
  jobKey?: JobKey;
}


