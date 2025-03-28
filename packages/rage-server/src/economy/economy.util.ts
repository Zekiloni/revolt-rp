import { Property } from '../property/property.model';
import { economyConfig } from './economy.config';
import { CommercialType, PropertyType } from '@revolt-rp/common';


export const calculateTaxRate = (property: Property) => {
  let tax = economyConfig.taxRate;

  if (property.type === PropertyType.Commercial && property.subType === CommercialType.VehicleRent)
    tax += economyConfig.rentalServiceTaxRate;

  return tax;
}
