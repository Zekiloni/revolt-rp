import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { catchError, IGangRecordCreate, ProcedureKey } from '@revolt-rp/common';
import { createGangRecord, getAllGangRecords } from './gang-record.service';

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

register(ProcedureKey.SERVER_CREATE_GANG_RECORD, createGangRecordHandler);
register(ProcedureKey.SERVER_GET_GANG_RECORDS, getAllGangRecordsHandler);
