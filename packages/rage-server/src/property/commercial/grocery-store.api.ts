import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IShopping, ProcedureKey } from '@revolt-rp/common';
import { getPropertyById } from '../property.service';
import { buyGroceries } from './grocery-store.service';


function groceryStoreBuyHandler(data: IShopping<string>, { player }: ProcedureListenerInfo<PlayerMp>) {
 getPropertyById(data.propertyId)
   .then(property => buyGroceries(player, property, data.shoppingCart, data.payment))
}

on(ProcedureKey.SERVER_GROCERY_STORE_BUY, groceryStoreBuyHandler);
