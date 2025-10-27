import { CommercialType, PropertyType } from '@revolt-rp/common';
import { economyConfig, Property } from '@revolt-rp/core';


export const calculateTaxRate = (property: Property): number => {
  const { taxRate, rentalServiceTaxRate, vehicleBuyTaxRate } = economyConfig;
  let tax = taxRate;

  if (property.type === PropertyType.Commercial) {
    switch (property.subType) {
      case CommercialType.VehicleRent:
        tax += rentalServiceTaxRate;
        break;
      case CommercialType.VehicleDealership:
        tax += vehicleBuyTaxRate;
        break;
    }
  }

  return tax;
};
