import { CommercialType, IProduct, IProductAdd, ItemType, vehicleModels } from '@revolt-rp/common';
import { filterItemsByType } from '../../item/registry/item-registry.util';
import { vehicleRentConfig } from '../commercial/vehicle-rent.config';
import { Property } from '../property.model';
import { Product } from './product.model';


const catalogItems = {
  [CommercialType.GroceryStore]: filterItemsByType(ItemType.PRODUCT_GROCERY)
    .map(item => item.name),

  [CommercialType.ClothingStore]: filterItemsByType(ItemType.PRODUCT_CLOTHING_STORE)
    .map(item => item.name),

  [CommercialType.VehicleRent]: vehicleRentConfig.availableVehicles,
  [CommercialType.VehicleDealership]: vehicleModels
};


export const getAvailableCatalogItems = (property: Property) => {
  return catalogItems[property.subType] || [];
};

export const addProductToCatalog = async (property: Property, productAdd: IProductAdd) => {
  const product = new Product();
  product.name = productAdd.name;
  product.price = productAdd.price;
  product.stock = 0;

  property.catalog.push(product);
  await property.save();

  return product;
};

export const removeProductFromCatalog = async (property: Property, product: IProduct) => {
  property.catalog = property.catalog.filter(p => p.id !== product.id);
  await property.save();
};


// export const updateCatalogProduct = async (property: Property, product: IProduct) => {
//   property.catalog = property.catalog.map(p => p.name === product.name ? product : p);
//   property.markModified('catalog');
//   await property.save();
// };
