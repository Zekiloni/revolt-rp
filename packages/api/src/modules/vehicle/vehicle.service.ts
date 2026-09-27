import { FilterQuery, UpdateQuery } from 'mongoose';
import { Vehicle, VehicleModel } from '@revolt-rp/core';
import { VehicleCreateInput, VehicleUpdateInput } from '@revolt-rp/api-contract';

export const getAllVehicles = (filter: FilterQuery<Vehicle> = {}, limit = 50, offset = 0) => {
  return Promise.all([
    VehicleModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
    VehicleModel.countDocuments(filter).exec()
  ]);
};

export const getVehicleById = (id: string) => {
  return VehicleModel.findById(id).exec();
};

export const createVehicle = (input: VehicleCreateInput) => {
  return VehicleModel.create(input);
};

export type UpdateVehicleResult =
  | { status: 'ok'; vehicle: Vehicle }
  | { status: 'conflict'; vehicle: Vehicle | null }
  | { status: 'not_found' };

export const updateVehicle = async (id: string, input: VehicleUpdateInput): Promise<UpdateVehicleResult> => {
  const { rev, ...fields } = input;

  const filter: FilterQuery<Vehicle> = rev !== undefined ? { _id: id, rev } : { _id: id };

  const update: UpdateQuery<Vehicle> = {
    $set: fields,
    $inc: { rev: 1 }
  };

  const vehicle = await VehicleModel.findOneAndUpdate(filter, update, { new: true }).exec();

  if (vehicle) {
    return { status: 'ok', vehicle };
  }

  const exists = await VehicleModel.exists({ _id: id }).exec();

  if (!exists) {
    return { status: 'not_found' };
  }

  const current = rev !== undefined ? await VehicleModel.findById(id).exec() : null;

  return { status: 'conflict', vehicle: current };
};

export const deleteVehicle = (id: string) => {
  return VehicleModel.findByIdAndDelete(id).exec();
};
