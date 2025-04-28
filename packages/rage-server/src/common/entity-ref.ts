import { getModelForClass } from '@typegoose/typegoose';
import { Character } from '../player/character/character.model';
import { Property } from '../property/property.model';
import { Vehicle } from '../vehicle/vehicle.model';
import { Account } from '../player/account/account.model';

export const AccountModel = getModelForClass(Account);

export const CharacterModel = getModelForClass(Character);
export const PropertyModel = getModelForClass(Property);

export const VehicleModel = getModelForClass(Vehicle);
