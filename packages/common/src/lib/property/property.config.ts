import { CommercialType, PropertyType, PublicServiceType } from './property.enums';


export const purchasablePropertyTypes: PropertyType[] = [
  PropertyType.Residential,
  PropertyType.Commercial,
  PropertyType.Garage
]

export const propertySubTypeMap: Record<PropertyType, string[]> = {
  [PropertyType.Residential]: [],
  [PropertyType.Commercial]: Object.values(CommercialType),
  [PropertyType.Garage]: [],
  [PropertyType.PublicService]: Object.values(PublicServiceType),
  [PropertyType.Industrial]: [],
  [PropertyType.Utility]: [],
  [PropertyType.Other]: []
};
