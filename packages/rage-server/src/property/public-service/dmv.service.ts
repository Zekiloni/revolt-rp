import { GameUiKey, IDrivingQuiz, ProcedureKey, VehicleSharedDataType } from '@revolt-rp/common';
import { Property } from '../property.model';
import { dmvConfig } from './dmv.config';
import { triggerClient } from '@libertymp/rage-rpc';
import { getPropertyAvailableParkingSpot } from '../property.service';
import { createTemporaryVehicle, setVehicleOwner } from '../../vehicle/vehicle.service';


export const getDrivingQuiz = (): IDrivingQuiz => {
  const quiz = dmvConfig.quiz;

  const shuffledQuestions = quiz.questions.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffledQuestions.slice(0, quiz.maxQuestions);

  return {
    ...quiz,
    questions: selectedQuestions
  };
};

export function openDmvMenu(player: PlayerMp, property: Property) {
  triggerClient(player, ProcedureKey.CLIENT_PLAYER_SHOW_INTERFACE, GameUiKey.DmvMenu);
}

export function startDrivingTest(player: PlayerMp, property: Property) {
  const propertyAvailableParkingSpot = getPropertyAvailableParkingSpot(property);

  console.log('startDrivingTest', propertyAvailableParkingSpot);

  const vehicle = createTemporaryVehicle('sultan', player.position, 1, 1);
  setVehicleOwner(vehicle, player.character);

  vehicle.setVariable(VehicleSharedDataType.DrivingTest, true);
  triggerClient(player, ProcedureKey.CLIENT_START_DRIVING_TEST, vehicle);
  // todo create vehicle etc
}
