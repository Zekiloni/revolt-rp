import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { getDrivingQuiz, startDrivingTest } from './dmv.service';
import { getPropertyById } from '../property.service';


function getDrivingQuizHandler() {
  return getDrivingQuiz();
}

function startDrivingTestHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(propertyId)
    .then(property => startDrivingTest(player, property));
}

register(ProcedureKey.SERVER_GET_DRIVING_QUIZ, getDrivingQuizHandler);
on(ProcedureKey.SERVER_START_DRIVING_TEST, startDrivingTestHandler);
