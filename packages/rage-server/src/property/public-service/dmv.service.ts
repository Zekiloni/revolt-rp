import { triggerBrowsers, triggerClient } from '@libertymp/rage-rpc';
import {
  DrivingLicenseCategory,
  DrivingTestMistakeType,
  GameUiKey,
  IDrivingQuiz,
  ProcedureKey,
  VehicleSharedDataType
} from '@revolt-rp/common';
import { Property } from '../property.model';
import { dmvConfig } from './dmv.config';
import { getPropertyAvailableParkingSpot } from '../property.service';
import { showPlayerGameInterface } from '../../player/util/player.util';
import { createTemporaryVehicle, setVehicleOwner } from '../../vehicle/vehicle.service';
import { playerCreateDrivingLicense } from '../../player/inventory/player-document.service';
import { generateNumberPlate } from '../../vehicle/vehicle.util';


export const isDrivingTestVehicle = (vehicle: VehicleMp) => {
  return vehicle.getVariable(VehicleSharedDataType.DrivingTest);
};

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
  showPlayerGameInterface(player, GameUiKey.DmvMenu, () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_PROPERTY, property));
}

export function startDrivingTest(player: PlayerMp, property: Property) {
  const propertyAvailableParkingSpot = getPropertyAvailableParkingSpot(property);

  if (!propertyAvailableParkingSpot) {
    return;
  }

  const { x, y, z } = propertyAvailableParkingSpot.position;
  const { x: rotX, y: rotY, z: rotZ } = propertyAvailableParkingSpot.rotation;

  const color = dmvConfig.drivingTest.vehicleColor;
  const vehicle = createTemporaryVehicle(dmvConfig.drivingTest.vehicleModel, new mp.Vector3(x, y, z), color, color, {
    rotation: new mp.Vector3(rotX, rotY, rotZ)
  });

  vehicle.numberPlate = dmvConfig.drivingTest.vehicleNumberplate + generateNumberPlate(4);
  setVehicleOwner(vehicle, player.character);

  vehicle.setVariable(VehicleSharedDataType.DrivingTest, true);
  triggerClient(player, ProcedureKey.CLIENT_START_DRIVING_TEST, vehicle);
}


export async function completeDrivingTest(player: PlayerMp, mistakes: DrivingTestMistakeType[]) {
  const vehicle = player.vehicle;

  if (vehicle && isDrivingTestVehicle(vehicle)) {
    player.removeFromVehicle();

    // todo output mistakes

    setTimeout(() => {
      if (vehicle && mp.vehicles.exists(vehicle)) {
        vehicle.destroy();
      }
    }, 2500);

    if (mistakes.length >= dmvConfig.drivingTest.maxMistakes) {
      // todo fail driving test
    } else {
      await playerCreateDrivingLicense(player, DrivingLicenseCategory.Vehicle);
      // todo send info message
    }

    mistakes.forEach((mistake) => {

    });
  }
}
