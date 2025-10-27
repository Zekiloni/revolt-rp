import { FilterQuery } from 'mongoose';
import { IAdvertisementCreate } from '@revolt-rp/common';
import { Advertisement, AdvertisementModel, Character } from '@revolt-rp/core';


export const getAdvertisementById = async (id: string) => {
  return AdvertisementModel.findById(id)
    .populate('author')
    .exec();
};

export const createAdvertisement = async (author: Character, phoneNumber: string, advertisementCreate: IAdvertisementCreate) => {
  return AdvertisementModel.create({
    author,
    phoneNumber,
    ...advertisementCreate
  });
};


export const getAdvertisements = async (skip: number, limit: number, query: FilterQuery<Advertisement> = {}) => {
  const [advertisements, total] = await Promise.all([
    AdvertisementModel.find({ ...query })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('author')
      .exec(),
    AdvertisementModel.count(query)
  ]);

  return { advertisements, total };
};


export const getMyAdvertisements = async (author: Character) => {
  return getAdvertisements(0, 100, { author: author._id });
};


export const deleteAdvertisement = async (advertisement: Advertisement) => {
  return advertisement.remove();
};
