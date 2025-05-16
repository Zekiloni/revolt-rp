import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { catchError, IGangRecordCreate, ProcedureKey } from '@revolt-rp/common';
import { createGangRecord, deleteGangRecord, getAllGangRecords } from './gang-record.service';

async function createGangRecordHandler(
  gangRecord: IGangRecordCreate,
  { player }: ProcedureListenerInfo<PlayerMp>
) {
  return createGangRecord(gangRecord, player.character)
    .then((e) => e)
    .catch(catchError);
}

async function getAllGangRecordsHandler() {
  return getAllGangRecords();
}

async function deleteGangRecordHandler(id: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  return deleteGangRecord(id, player.character)
    .then((e) => e)
    .catch(catchError);
}

register(ProcedureKey.SERVER_CREATE_GANG_RECORD, createGangRecordHandler);
register(ProcedureKey.SERVER_GET_GANG_RECORDS, getAllGangRecordsHandler);
register(ProcedureKey.SERVER_DELETE_GANG_RECORD, deleteGangRecordHandler);
