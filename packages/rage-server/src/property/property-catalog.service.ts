import { Property } from './property.model';
import { CommercialType, IProduct, ItemType } from '@revolt-rp/common';
import { itemRegistry } from '../item/registry/base-item.model';
import { vehicleRentConfig } from './commercial/vehicle-rent.config';


const catalogItems = {
  [CommercialType.GroceryStore]: [...itemRegistry.values()]
    .filter(item => item.type.includes(ItemType.PRODUCT_GROCERY))
    .map(item => item.name),

  [CommercialType.VehicleRent]: vehicleRentConfig.availableVehicles
};


export const getAvailableCatalogItems = (property: Property) => {
  return catalogItems[property.subType] || [];
};

export const addProductToCatalog = async (property: Property, product: IProduct) => {
  property.catalog.push(product);
  await property.save();
};

export const removeProductFromCatalog = async (property: Property, product: IProduct) => {
  property.catalog = property.catalog.filter(p => p.name !== product.name);
  await property.save();
};

export const updateCatalogProduct = async (property: Property, product: IProduct) => {
  property.catalog = property.catalog.map(p => p.name === product.name ? product : p);
  property.markModified('catalog');
  await property.save();
};
