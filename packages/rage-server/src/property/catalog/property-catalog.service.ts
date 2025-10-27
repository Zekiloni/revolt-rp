import { CommercialType, IProduct, IProductAdd, ItemType, vehicleModels } from '@revolt-rp/common';
import { filterItemsByType, getBaseItem, isValidItem } from '../../item/registry/item-registry.util';
import { vehicleRentConfig } from '../commercial/vehicle-rent.config';
import { Product, ProductModel, Property } from '@revolt-rp/core';

ProductModel.schema.virtual('data').get(function() {
  return isValidItem(this.name) ? getBaseItem(this.name) : null;
});

const catalogItems = {
  [CommercialType.GroceryStore]: filterItemsByType(ItemType.PRODUCT_GROCERY)
    .map(item => item.name),

  [CommercialType.GasStation]: [...filterItemsByType(ItemType.PRODUCT_GAS_STATION), ...filterItemsByType(ItemType.PRODUCT_GROCERY)]
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


export const updateCatalogProduct = async (property: Property, product: IProduct) => {
  const index = property.catalog.findIndex((p) => p.id === product.id);

  if (index !== -1) {
    property.catalog[index]['stock'] = product.stock;
    property.catalog[index]['price'] = product.price;
    property.catalog[index]['discount'] = product.discount;
    property.catalog[index]['ordered'] = product.ordered;
  }

  property.markModified('catalog');
  await property.save();

  return property.catalog[index];
};
