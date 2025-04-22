import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IClothingCartItem, IClothingProduct, IShopping, ProcedureKey } from '@revolt-rp/common';
import { getPropertyById } from '../property.service';
import { buyClothes } from './clothing-store.service';


function clothingStoreBuyHandler(data: IShopping<IClothingProduct>, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(data.propertyId)
    .then(property => buyClothes(player, property, data.shoppingCart as IClothingCartItem[], data.payment));
}

on(ProcedureKey.SERVER_CLOTHING_STORE_BUY, clothingStoreBuyHandler);
