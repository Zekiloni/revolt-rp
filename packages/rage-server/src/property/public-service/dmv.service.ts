import { t } from 'i18next';
import { triggerBrowsers, triggerClient } from '@libertymp/rage-rpc';
import {
  DrivingLicenseCategory,
  DrivingTestMistakeType,
  GameUiKey,
  hexColors,
  IDrivingQuiz,
  IRegisterVehicle,
  PaymentType,
  ProcedureKey,
  VehicleSharedDataType
} from '@revolt-rp/common';
import { dmvConfig } from './dmv.config';
import { getPropertyAvailableParkingSpot, getPropertyById } from '../property.service';
import { showPlayerGameInterface } from '../../player/util/player.util';
import { createTemporaryVehicle, getVehicleById, setVehicleOwner } from '../../vehicle/vehicle.service';
import { playerCreateDrivingLicense } from '../../player/inventory/player-document.service';
import { generateNumberPlate } from '../../vehicle/vehicle.util';
import { makeOnlinePayment } from '../../banking/banking.service';
import { notifyPlayer } from '../../player/util/player-notify.util';
import { giveMoney } from '../../player/character/character.service';
import { calculateTaxRate } from '../../banking/tax.util';
import dayjs from 'dayjs';
import { economyConfig, Property, Vehicle, vehicleConfig } from '@revolt-rp/core';
import { VehicleNumberplate } from '../../../../core/src/lib/persistence/model/vehicle.model';


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
    rotation: new mp.Vector3(rotX, rotY, rotZ),
    engine: false
  });

  const content = t('says', { person: t('instructor'), text: t('dmv_hint_head_to_vehicle') });
  player.outputChatBox(`!{${hexColors.WHITE_PALETTE[0]}}${content}`);

  vehicle.numberPlate = dmvConfig.drivingTest.vehicleNumberplate + generateNumberPlate(4);
  setVehicleOwner(vehicle, player.character);
  player.putIntoVehicle(vehicle, RageEnums.VehicleSeat.DRIVER);

  vehicle.setVariable(VehicleSharedDataType.DrivingTest, true);
  triggerClient(player, ProcedureKey.CLIENT_START_DRIVING_TEST, vehicle);
}


export async function completeDrivingTest(player: PlayerMp, mistakes: DrivingTestMistakeType[]) {
  const vehicle = player.vehicle;

  if (vehicle && isDrivingTestVehicle(vehicle)) {
    player.removeFromVehicle();

    vehicle.setVariable(VehicleSharedDataType.DrivingTest, false);
    setTimeout(() => {
      if (vehicle && mp.vehicles.exists(vehicle)) {
        vehicle.destroy();
      }
    }, 2500);

    let content = '';

    if (mistakes.length >= dmvConfig.drivingTest.maxMistakes) {
      content = t('says', { person: t('instructor'), text: t('dmv_failed_driving_test') });
      player.outputChatBox(`!{${hexColors.WHITE_PALETTE[0]}}${content}`);
    } else {
      await playerCreateDrivingLicense(player, DrivingLicenseCategory.Vehicle);
      content = t('says', { person: t('instructor'), text: t('dmv_passed_driving_test') });
      player.outputChatBox(`!{${hexColors.WHITE_PALETTE[0]}}${content}`);
    }

    content = t('says', { person: t('instructor'), text: t('mistake_count', { count: mistakes.length }) });
    player.outputChatBox(`!{${hexColors.WHITE_PALETTE[0]}}${content}`);
  }
}

export const dmvInstructorSays = (player: PlayerMp, mistake: DrivingTestMistakeType) => {
  const content = t('says', { person: t('instructor'), text: t(mistake) });
  player.outputChatBox(`!{${hexColors.WHITE_PALETTE[0]}}${content}`);
};


export const registerVehicle = async (player: PlayerMp, data: IRegisterVehicle) => {
  const { payment, vehicleId, propertyId, type: optionType } = data;
  const total = optionType === 'register' ? economyConfig.vehicleRegistrationFee : economyConfig.vehicleRenewalFee;
  const property = await getPropertyById(propertyId);

  let vehicle: VehicleMp | Vehicle | null;
  vehicle = mp.vehicles.toArray().find(v => v.info.id === vehicleId) || null;

  if (!vehicle) {
    vehicle = await getVehicleById(vehicleId);
  }

  if (!vehicle) {
    notifyPlayer(player, { severity: 'error', detail: t('vehicle_not_found') });
    return false;
  }

  if (payment.type === PaymentType.BankCard && payment.bankAccountNo) {
    try {
      await makeOnlinePayment(player, payment.bankAccountNo, property, total);
    } catch (error) {
      notifyPlayer(player, { severity: 'error', detail: error.message || t('online_payment_failed') });
      return false;
    }
  } else {
    if (player.character.cash < total) {
      notifyPlayer(player, { severity: 'error', detail: t('not_enough_money') });
      return false;
    }

    await giveMoney(player, -total);
    property.balance = (property.balance + (total - calculateTaxRate(property)));
    await property.save();
  }


  const content = optionType === 'register'
    ? generateNumberPlate(8)
    : (vehicle instanceof mp.Vehicle ? vehicle.info.numberplate.content : vehicle.numberplate.content);

  // TODO: Recalculate expiration based on current expiration date if renewing
  const newNumberPlate = {
    content,
    expiringAt: dayjs().add(vehicleConfig.numberplateExpireDays).toDate(),
    modelType: vehicleConfig.defaultNumberPlateType,
    vehicleId: vehicle instanceof mp.Vehicle ? vehicle.info.id : vehicle.id
  };

  if (vehicle instanceof mp.Vehicle) {
    vehicle.info.numberplate = new VehicleNumberplate(newNumberPlate);
    await vehicle.info.save();

    vehicle.numberPlate = newNumberPlate.content;
    vehicle.numberPlateType = newNumberPlate.modelType;

  } else if (vehicle instanceof Vehicle) {
    vehicle.numberplate = new VehicleNumberplate(newNumberPlate);
    await vehicle.save();
  }

  return true;
};
