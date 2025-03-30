import dayjs from 'dayjs';
import { t } from 'i18next';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { GameUiKey, IPayment, PaymentType, ProcedureKey } from '@revolt-rp/common';
import {
  findPlayerByCharacterId,
  hidePlayerGameInterface,
  showPlayerGameInterface
} from '../../player/util/player.util';
import { getPropertyAvailableParkingSpot, getPropertyById } from '../property.service';
import { notifyPlayer, sendInfoMessage } from '../../player/util/player-notify.util';
import { giveMoney } from '../../player/character/character.service';
import { makeOnlinePayment } from '../../banking/banking.service';
import { generateNumberPlate } from '../../vehicle/vehicle.util';
import { calculateTaxRate } from '../../economy/economy.util';
import { createVehicle } from '../../vehicle/vehicle.service';
import { vehicleConfig } from '../../vehicle/vehicle.config';
import { VehicleModel } from '../../vehicle/vehicle.model';
import { Property } from '../property.model';
import { vehicleRentConfig } from './vehicle-rent.config';


export function openRentMenu(player: PlayerMp, property: Property) {
  showPlayerGameInterface(player, GameUiKey.RentCatalog,
    () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_PROPERTY, property));
}

export const isPlayerRentingVehicle = async (player: PlayerMp) => {
  return VehicleModel.findOne({ owner: player.character.id, rented: true })
    .exec();
};

export const returnVehicle = async (vehicle: VehicleMp, player?: PlayerMp) => {
  const model = vehicle.info.model;

  await vehicle.info.delete();

  vehicle.getOccupants().forEach(p => p.removeFromVehicle());

  if (vehicle && mp.vehicles.exists(vehicle))
    vehicle.destroy();

  const property = await getPropertyById(vehicle.info.rentAgencyId);
  if (property) {
    const product = property.catalog.find(p => p.name === model);
    if (product) {
      product.stock = (product.stock + 1);
      await property.save();
    }
  }

  if (player && mp.players.exists(player))
    sendInfoMessage(player, t('vehicle_rent_returned'));
};

export const checkVehicleRent = async (vehicle: VehicleMp) => {
  const info = vehicle.info;

  const now = dayjs();
  const expiresAt = dayjs(info.expiringAt);

  const player = findPlayerByCharacterId(info.owner._id.toHexString());

  if (expiresAt.diff(now, 'minute') === vehicleRentConfig.expireAnnounceMinutes) {
    if (player)
      sendInfoMessage(player, t('vehicle_rent_expiring', { min: vehicleRentConfig.expireAnnounceMinutes }));
  }

  if (dayjs(info.expiringAt).isBefore(dayjs())) {
    await returnVehicle(vehicle);
    if (player)
      sendInfoMessage(player, t('vehicle_rent_expired'));
  }
};

export const rentVehicle = async (player: PlayerMp, property: Property, model: string, duration: number, payment: IPayment) => {
  const alreadyRented = await isPlayerRentingVehicle(player);

  if (alreadyRented)
    return notifyPlayer(player, { severity: 'error', detail: t('already_renting_vehicle') });

  const product = property.catalog.find(p => p.name === model);

  if (!product || !product.stock)
    return notifyPlayer(player, { severity: 'error', detail: t('catalog_vehicle_not_found') });

  const parkingSpot = getPropertyAvailableParkingSpot(property);

  if (!parkingSpot) {
    return notifyPlayer(player, { severity: 'error', detail: t('no_available_parking_spots') });
  }

  const total = product.price * duration;
  product.stock = (product.stock - 1);

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
    property.balance = (property.balance + (total - calculateTaxRate(property)));
  }

  await property.save();

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
    },
    rentAgencyId: property.id
  });

  // todo: messages
  hidePlayerGameInterface(player, GameUiKey.RentCatalog);
};
