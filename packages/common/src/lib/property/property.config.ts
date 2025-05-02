import { CommercialType, PropertyType, PublicServiceType, UtilityType } from './property.enums';
import { JobKey } from '../job/job.enums';


export const purchasablePropertyTypes: PropertyType[] = [
  PropertyType.Residential,
  PropertyType.Commercial,
  PropertyType.Garage
];

export const propertySubTypeMap: Record<PropertyType, string[]> = {
  [PropertyType.Residential]: [],
  [PropertyType.Commercial]: Object.values(CommercialType),
  [PropertyType.Garage]: [],
  [PropertyType.PublicService]: Object.values(PublicServiceType),
  [PropertyType.Industrial]: [],
  [PropertyType.Utility]: Object.values(UtilityType),
  [PropertyType.Other]: []
};

export const propertyJobMap: Record<string, JobKey> = {
  [UtilityType.RecyclingCenter]: JobKey.Sanitation
};
