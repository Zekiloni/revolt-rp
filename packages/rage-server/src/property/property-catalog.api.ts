import { getPropertyById } from './property.service';
import { getAvailableCatalogItems } from './property-catalog.service';
import { register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';


export const getAvailableCatalogItemsHandler = async (propertyId: string) => {
  return getPropertyById(propertyId)
    .then(property => getAvailableCatalogItems(property));
};

register(ProcedureKey.SERVER_GET_CATALOG_AVAILABLE_ITEMS, getAvailableCatalogItemsHandler);
