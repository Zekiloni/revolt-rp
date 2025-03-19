import { FilterQuery } from 'mongoose';
import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { IAdvertisementCreate, ProcedureKey } from '@revolt-rp/common';
import { getPlayerSelectedItem } from '../../player/inventory/player-inventory.service';
import { createAdvertisement, getAdvertisements } from './advertisement.service';
import { Advertisement } from './advertisement.model';


function createAdvertisementHandler(adCreate: IAdvertisementCreate, { player }: ProcedureListenerInfo<PlayerMp>) {
  const selectedItem = getPlayerSelectedItem(player);
  return createAdvertisement(player.character, selectedItem.phoneInfo.phoneNumber, adCreate);
}

function getAdvertisementsHandler(filter?: FilterQuery<Advertisement>) {
  return getAdvertisements(filter);
}

function getMyAdvertisementsHandler(_args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  return getAdvertisements({ author: player.character._id });
}


register(ProcedureKey.SERVER_GET_MY_ADVERTISEMENTS, getMyAdvertisementsHandler);
register(ProcedureKey.SERVER_GET_ADVERTISEMENTS, getAdvertisementsHandler);
register(ProcedureKey.SERVER_CREATE_ADVERTISEMENT, createAdvertisementHandler);
