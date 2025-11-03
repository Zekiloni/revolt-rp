import { FilterQuery } from 'mongoose';
import { Vehicle, VehicleModel } from '@revolt-rp/core';


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
