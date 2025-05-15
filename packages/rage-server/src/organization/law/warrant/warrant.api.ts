import { catchError, IWarrantCreate, ProcedureKey } from '@revolt-rp/common';
import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { createWarrant, getAllWarrants } from './warrant.service';

async function createWarrantHandler(
  warrant: IWarrantCreate,
  { player }: ProcedureListenerInfo<PlayerMp>
) {
  return createWarrant(warrant, player.character)
    .then((e) => e)
    .catch(catchError);
}

async function getAllWarrantsHandler() {
  return getAllWarrants();
}

register(ProcedureKey.SERVER_CREATE_WARRANT, createWarrantHandler);
register(ProcedureKey.SERVER_GET_WARRANTS, getAllWarrantsHandler);

