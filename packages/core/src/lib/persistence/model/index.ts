import { getDiscriminatorModelForClass, getModelForClass } from '@typegoose/typegoose';
import { Account } from './account.model';
import { Advertisement } from './advertisement.model';
import { Ban } from './ban.model';
import { BankAccount } from './bank-account.model';
import { Character } from './character.model';
import { CriminalRecord } from './criminal-record.model';
import { GangRecord } from './gang-record.model';
import { Item } from './item.model';
import { Kick } from './kick.model';
import { Organization } from './organization.model';
import { OrganizationRank } from './organization-rank.model';
import { PhoneCall } from './phone-call.model';
import { PhoneMessage } from './phone-message.model';
import { PlayerDeath } from './player-death.model';
import { Product } from './product.model';
import {
  DoorObject,
  FurnitureObject,
  Property,
  PropertyObject,
  PropertyOwner,
  PropertyPoint,
  PropertyVehicle, StaticObject
} from './property.model';
import { SobrietyTest } from './sobriety-test.model';
import { Transaction } from './transaction.model';
import { Vehicle, VehicleNumberplate } from './vehicle.model';
import { Warrant } from './warrant.model';
import { Whitelist } from './whitelist.model';
import { ObjectType } from '@revolt-rp/common';

export const AccountModel = getModelForClass(Account);
export const WhiteListModel = getModelForClass(Whitelist);
export const AdvertisementModel = getModelForClass(Advertisement);
export const BanModel = getModelForClass(Ban);
export const BankAccountModel = getModelForClass(BankAccount);
export const CharacterModel = getModelForClass(Character);
export const CriminalRecordModel = getModelForClass(CriminalRecord);
export const GangRecordModel = getModelForClass(GangRecord);
export const ItemModel = getModelForClass(Item);
export const KickModel = getModelForClass(Kick);
export const OrganizationModel = getModelForClass(Organization);
export const OrganizationRankModel = getModelForClass(OrganizationRank);
export const PhoneCallModel = getModelForClass(PhoneCall);
export const PhoneMessageModel = getModelForClass(PhoneMessage);
export const PlayerDeathModel = getModelForClass(PlayerDeath);

export const PropertyModel = getModelForClass(Property);
export const ProductModel = getModelForClass(Product);
export const PropertyObjectModel =
  getModelForClass(PropertyObject);

export const DoorObjectModel =
  getDiscriminatorModelForClass(
    PropertyObjectModel,
    DoorObject,
    ObjectType.Door
  );

export const FurnitureObjectModel =
  getDiscriminatorModelForClass(
    PropertyObjectModel,
    FurnitureObject,
    ObjectType.Furniture
  );

export const StaticObjectModel =
  getDiscriminatorModelForClass(
    PropertyObjectModel,
    StaticObject,
    ObjectType.Static
  );

export const SobrietyTestModel = getModelForClass(SobrietyTest);
export const TransactionModel = getModelForClass(Transaction);
export const VehicleModel = getModelForClass(Vehicle);
export const WarrantModel = getModelForClass(Warrant);

export {
  Account,
  Advertisement,
  Ban,
  BankAccount,
  Character,
  CriminalRecord,
  GangRecord,
  Item,
  Kick,
  Organization,
  OrganizationRank,
  Whitelist,
  PhoneCall,
  PhoneMessage,
  PlayerDeath,
  Product,
  VehicleNumberplate,
  Property,
  PropertyOwner,
  PropertyPoint,
  PropertyVehicle,
  PropertyObject,
  DoorObject,
  FurnitureObject,
  StaticObject,
  SobrietyTest,
  Transaction,
  Vehicle,
  Warrant,
};
