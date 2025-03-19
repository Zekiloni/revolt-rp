import { FilterQuery } from 'mongoose';
import { IAdvertisementCreate } from '@revolt-rp/common';
import { Advertisement, AdvertisementModel } from './advertisement.model';
import { Character } from '../../player/character/character.model';
import { Item } from '../../item/item.model';


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


export const getAdvertisements = async (query: FilterQuery<Advertisement> = {}) => {
  return AdvertisementModel.find({ ...query })
    .sort({ createdAt: -1 })
    .populate('author')
    .exec();
};


export const getMyAdvertisements = async (author: Character) => {
  return getAdvertisements({ author: author._id });
};


export const deleteAdvertisement = async (advertisement: Advertisement) => {
  return advertisement.remove();
};
