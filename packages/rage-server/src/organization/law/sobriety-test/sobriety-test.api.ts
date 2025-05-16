import { catchError, ISobrietyTestCreate, ProcedureKey } from '@revolt-rp/common';
import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { createSobrietyTest, getAllSobrietyTests } from './sobriety-test.service';

async function createSobrietyTestHandler(
  sobrietyTest: ISobrietyTestCreate,
  { player }: ProcedureListenerInfo<PlayerMp>
) {
  return createSobrietyTest(sobrietyTest, player.character)
    .then((e) => e)
    .catch(catchError);
}
async function getAllSobrietyTestsHandler() {
  return getAllSobrietyTests();
}

register(ProcedureKey.SERVER_CREATE_SOBRIETY_TEST, createSobrietyTestHandler);
register(ProcedureKey.SERVER_GET_SOBRIETY_TEST, getAllSobrietyTestsHandler);
