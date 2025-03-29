import dayjs from 'dayjs';
import { t } from 'i18next';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { GameUiKey, IPayment, PaymentType, ProcedureKey } from '@revolt-rp/common';
import { hidePlayerGameInterface, showPlayerGameInterface } from '../../player/util/player.util';
import { notifyPlayer } from '../../player/util/player-notify.util';
import { generateNumberPlate } from '../../vehicle/vehicle.util';
import { createVehicle } from '../../vehicle/vehicle.service';
import { vehicleConfig } from '../../vehicle/vehicle.config';
import { VehicleModel } from '../../vehicle/vehicle.model';
import { Property } from '../property.model';
import { getPropertyAvailableParkingSpot } from '../property.service';
import { giveMoney } from '../../player/character/character.service';
import { makeOnlinePayment } from '../../banking/banking.service';


export function openRentMenu(player: PlayerMp, property: Property) {
  showPlayerGameInterface(player, GameUiKey.RentCatalog,
    () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_PROPERTY, property));
}

export const isPlayerRentingVehicle = async (player: PlayerMp) => {
  return VehicleModel.findOne({ owner: player.character.id, rented: true })
    .exec();
};


export const rentVehicle = async (player: PlayerMp, property: Property, model: string, duration: number, payment: IPayment) => {
  const alreadyRented = await isPlayerRentingVehicle(player);

  if (alreadyRented)
    return notifyPlayer(player, { severity: 'error', detail: t('already_renting_vehicle') });

  const product = property.catalog.find(p => p.name === model);

  if (!product)
    return notifyPlayer(player, { severity: 'error', detail: t('catalog_vehicle_not_found') });

  const parkingSpot = getPropertyAvailableParkingSpot(property);

  if (!parkingSpot) {
    return notifyPlayer(player, { severity: 'error', detail: t('no_available_parking_spots') });
  }

  const total = product.price * duration;

  if (payment.type === PaymentType.BankCard && payment.bankAccountNo) {
    try {
      await makeOnlinePayment(player, payment.bankAccountNo, property, total);
      notifyPlayer(player, { severity: 'success', detail: t('online_payment_success') });
    } catch (error) {
      return notifyPlayer(player, { severity: 'error', detail: error.message || t('online_payment_failed') });
    }
  } else {
    if (player.character.cash < total) {
      return notifyPlayer(player, { severity: 'error', detail: t('not_enough_money') });
    }

    await giveMoney(player, -total);
  }

  const expiringAt = dayjs()
    .add(duration, 'hour')
    .toDate();

  const color = Math.round(Math.random() * (159));
  const { x, y, z } = parkingSpot.position;
  const { x: rotX, y: rotY, z: rotZ } = parkingSpot.rotation;

  await createVehicle(model, new mp.Vector3(x, y, z), color, color, {
    expiringAt, rented: true,
    owner: player.character,
    rotation: new mp.Vector3(rotX, rotY, rotZ),
    numberplate: {
      numberplate: `RV${generateNumberPlate(4)}`,
      expiringAt,
      modelType: vehicleConfig.defaultNumberPlateType
    }
  });

  // todo: messages
  hidePlayerGameInterface(player, GameUiKey.RentCatalog);
};
