import { FilterQuery } from 'mongoose';
import { Property, PropertyModel } from '@revolt-rp/core';


export const getAllProperties = (filter: FilterQuery<Property> = {}, limit = 50, offset = 0) => {
  return Promise.all([
    PropertyModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
    PropertyModel.countDocuments(filter).exec()
  ]);
};
