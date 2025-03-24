import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { DrivingTestMistakeType, ProcedureKey } from '@revolt-rp/common';
import { completeDrivingTest, getDrivingQuiz, startDrivingTest } from './dmv.service';
import { getPropertyById } from '../property.service';


function getDrivingQuizHandler() {
  return getDrivingQuiz();
}

function startDrivingTestHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(propertyId)
    .then(property => startDrivingTest(player, property));
}

async function finishDrivingTestHandler(mistakes: DrivingTestMistakeType[], { player }: ProcedureListenerInfo<PlayerMp>) {
  await completeDrivingTest(player, mistakes);
}

on(ProcedureKey.SERVER_START_DRIVING_TEST, startDrivingTestHandler);
on(ProcedureKey.SERVER_FINISH_DRIVING_TEST, finishDrivingTestHandler);
register(ProcedureKey.SERVER_GET_DRIVING_QUIZ, getDrivingQuizHandler);
