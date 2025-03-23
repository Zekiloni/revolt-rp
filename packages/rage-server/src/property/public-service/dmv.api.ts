import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { getDrivingQuiz, startDrivingTest } from './dmv.service';
import { getPropertyById } from '../property.service';


function getDrivingQuizHandler() {
  return getDrivingQuiz();
}

function startDrivingTestHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  console.log('startDrivingTestHandler', propertyId);
  getPropertyById(propertyId)
    .then(property => startDrivingTest(player, property));
}

on(ProcedureKey.SERVER_START_DRIVING_TEST, startDrivingTestHandler);
register(ProcedureKey.SERVER_GET_DRIVING_QUIZ, getDrivingQuizHandler);
