import { getPropertyById } from '../property.service';
import { addProductToCatalog, getAvailableCatalogItems } from './property-catalog.service';
import { register } from '@libertymp/rage-rpc';
import { IProductAdd, ProcedureKey } from '@revolt-rp/common';


export const getAvailableCatalogItemsHandler = async (propertyId: string) => {
  return getPropertyById(propertyId)
    .then(property => getAvailableCatalogItems(property));
};


async function addProductToCatalogHandler(productAdd: IProductAdd) {
  return getPropertyById(productAdd.propertyId)
    .then(property => addProductToCatalog(property, productAdd));
}

register(ProcedureKey.SERVER_GET_CATALOG_AVAILABLE_ITEMS, getAvailableCatalogItemsHandler);
register(ProcedureKey.SERVER_CATALOG_ADD_PRODUCT, addProductToCatalogHandler);
