import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { catchError, IGangRecordCreate, ProcedureKey } from '@revolt-rp/common';
import { createGangRecord } from './gang-record.service';

async function createGangRecordHandler(
  gangRecord: IGangRecordCreate,
  { player }: ProcedureListenerInfo<PlayerMp>
) {
  return createGangRecord(gangRecord, player.character)
    .then((e) => e)
    .catch(catchError);
}

register(ProcedureKey.SERVER_CREATE_GANG_RECORD, createGangRecordHandler);
