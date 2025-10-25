import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { DrivingTestMistakeType, IRegisterVehicle, ProcedureKey } from '@revolt-rp/common';
import {
  completeDrivingTest,
  dmvInstructorSays,
  getDrivingQuiz,
  registerVehicle,
  startDrivingTest
} from './dmv.service';
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

function addDrivingTestMistakeHandler(mistake: DrivingTestMistakeType, { player }: ProcedureListenerInfo<PlayerMp>) {
  dmvInstructorSays(player, mistake);
}

function registerVehicleHandler(data: IRegisterVehicle, { player }: ProcedureListenerInfo<PlayerMp>) {
  return registerVehicle(player, data);
}

on(ProcedureKey.SERVER_START_DRIVING_TEST, startDrivingTestHandler);
on(ProcedureKey.SERVER_FINISH_DRIVING_TEST, finishDrivingTestHandler);
on(ProcedureKey.SERVER_ADD_DRIVING_TEST_MISTAKE, addDrivingTestMistakeHandler);
register(ProcedureKey.SERVER_REGISTER_VEHICLE, registerVehicleHandler)
register(ProcedureKey.SERVER_GET_DRIVING_QUIZ, getDrivingQuizHandler);
