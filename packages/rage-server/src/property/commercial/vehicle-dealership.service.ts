import { t } from 'i18next';
import { triggerClient } from '@libertymp/rage-rpc';
import {
  formatCurrency,
  IPayment,
  IProduct,
  PaymentType,
  ProcedureKey,
  PropertyPointType
} from '@revolt-rp/common';
import { notifyPlayer } from '../../player/util/player-notify.util';
import { Property } from '../property.model';
import { makeOnlinePayment } from '../../banking/banking.service';
import { giveMoney } from '../../player/character/character.service';
import { calculateTaxRate } from '../../economy/economy.util';
import { Product } from '../catalog/product.model';
import { getPropertyAvailableParkingSpot } from '../property.service';
import { createVehicle } from '../../vehicle/vehicle.service';

const getVehiclePreviewPoint = (property: Property) => {
  return property.points.find((point) => point.type === PropertyPointType.PreviewPoint);
};

export const toggleVehicleDealershipMenu = (player: PlayerMp, property: Property) => {
  const point = getVehiclePreviewPoint(property);

  if (!point) {
    return notifyPlayer(player, { severity: 'error', summary: t('vehicle_dealership.no_preview_point') });
  }

  const position = new mp.Vector3(point.position.x, point.position.y, point.position.z);
  const rotation = new mp.Vector3(point.rotation.x, point.rotation.y, point.rotation.z);
  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_DEALERSHIP_MENU, { property, position, rotation });
};

const calculateVehiclePrice = (product: Product) => {
  const discount = product.discount !== undefined ? product.discount : 0;
  return product.price * (1 - discount);
};

export const buyVehicle = async (player: PlayerMp, property: Property, vehicle: IProduct, payment: IPayment) => {
  const product = property.catalog.find(product => product.id === vehicle.id);

  if (!product || !product.stock)
    return notifyPlayer(player, { severity: 'error', detail: t('catalog_vehicle_not_found') });

  const parkingSpot = getPropertyAvailableParkingSpot(property);

  if (!parkingSpot) {
    return notifyPlayer(player, { severity: 'error', detail: t('no_available_parking_spots') });
  }

  const total = calculateVehiclePrice(product);

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

  product.stock = (product.stock - 1);
  await property.save();

  const color = Math.round(Math.random() * (159));
  const { x, y, z } = parkingSpot.position;
  const { x: rotX, y: rotY, z: rotZ } = parkingSpot.rotation;

  await createVehicle(vehicle.name, new mp.Vector3(x, y, z), color, color, {
    owner: player.character,
    rotation: new mp.Vector3(rotX, rotY, rotZ)
  });

  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_DEALERSHIP_MENU, null);

  notifyPlayer(player, {
    severity: 'success',
    detail: t('vehicle_dealership_purchase_success', { model: vehicle.name, price: formatCurrency(vehicle.price) })
  });
};
