import { JobKey } from '@revolt-rp/common';


/**
 * Configuration for the economy system.
 */
export const economyConfig = {

  // Tax rates
  taxRate: 0.2,
  rentalServiceTaxRate: 0.15,
  vehicleTaxRate: 0.002,
  propertyTaxRate: 0.01,
  vehicleBuyTaxRate:  0.1,

  // Default salary for jobs
  jobs: {
    [JobKey.Sanitation]: {
      baseSalary: 100,
      trashWeightCashOut: 0.75,
    }
  }
}
