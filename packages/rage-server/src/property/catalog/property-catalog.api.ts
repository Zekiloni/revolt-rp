import { getPropertyById } from '../property.service';
import {
  addProductToCatalog,
  getAvailableCatalogItems,
  removeProductFromCatalog,
  updateCatalogProduct
} from './property-catalog.service';
import { register } from '@libertymp/rage-rpc';
import { IProductAdd, IProductRemove, IProductUpdate, ProcedureKey } from '@revolt-rp/common';


export const getAvailableCatalogItemsHandler = async (propertyId: string) => {
  return getPropertyById(propertyId)
    .then(property => getAvailableCatalogItems(property));
};


async function addProductToCatalogHandler(productAdd: IProductAdd) {
  return getPropertyById(productAdd.propertyId)
    .then(property => addProductToCatalog(property, productAdd));
}

async function removeProductFromCatalogHandler(removeProduct: IProductRemove) {
  return getPropertyById(removeProduct.propertyId)
    .then(property => removeProductFromCatalog(property, removeProduct.product));
}

async function updateProductInCatalogHandler(updateProduct: IProductUpdate) {
  return getPropertyById(updateProduct.propertyId)
    .then(property => updateCatalogProduct(property, updateProduct.product));
}

register(ProcedureKey.SERVER_GET_CATALOG_AVAILABLE_ITEMS, getAvailableCatalogItemsHandler);
register(ProcedureKey.SERVER_CATALOG_ADD_PRODUCT, addProductToCatalogHandler);
register(ProcedureKey.SERVER_CATALOG_REMOVE_PRODUCT, removeProductFromCatalogHandler);
register(ProcedureKey.SERVER_CATALOG_UPDATE_PRODUCT, updateProductInCatalogHandler);
