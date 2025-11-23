import { IPayment } from '@revolt-rp/common';
import { getBaseItem, Item, Property } from '@revolt-rp/core';
import { makeOnlinePayment } from "../../banking/banking.service";
import { notifyPlayer } from '../../player/util/player-notify.util';
import { t } from "i18next";
import { giveMoney } from "../../player/character/character.service";
import { calculateTaxRate } from '../../banking/tax.util';
import { playerGiveItem } from '../../player/inventory/player-inventory.service';

export const processPayment = async (
  player: PlayerMp,
  property: Property,
  totalAmount: number,
  payment: IPayment,
  isBankCardPayment: boolean
): Promise<boolean> => {
  if (isBankCardPayment && payment.bankAccountNo) {
    try {
      await makeOnlinePayment(player, payment.bankAccountNo, property, totalAmount);
      return true;
    } catch (error: any) {
      notifyPlayer(player, {
        severity: 'error',
        detail: error?.message || t('online_payment_failed')
      });
      return false;
    }
  }

  if (player.character.cash < totalAmount) {
    notifyPlayer(player, { severity: 'error', detail: t('not_enough_money') });
    return false;
  }

  await giveMoney(player, -totalAmount);
  const taxAmount = calculateTaxRate(property);
  property.balance = property.balance + (totalAmount - taxAmount);

  return true;
};


export const processCartItem = async (
  player: PlayerMp,
  property: Property,
  productName: string,
  quantity: number,
  itemOptions?: Partial<Item>
): Promise<void> => {
  const product = property.catalog.find(p => p.name === productName);

  if (!product) {
    notifyPlayer(player, {
      severity: 'error',
      detail: t('product_not_found', { product: t(productName) })
    });
    return;
  }

  if (product.stock < quantity) {
    notifyPlayer(player, {
      severity: 'error',
      detail: t('product_out_of_stock', { product: t(product.name) })
    });
    return;
  }

  const baseItemDefinition = getBaseItem(product.name);
  if (!baseItemDefinition) {
    return;
  }

  if (baseItemDefinition.isStackable) {
    await playerGiveItem(player, baseItemDefinition.name, quantity, itemOptions);
  } else {
    for (let i = 0; i < quantity; i++) {
      await playerGiveItem(player, baseItemDefinition.name, 1, itemOptions);
    }
  }

  product.stock -= quantity;

  notifyPlayer(player, {
    severity: 'info',
    detail: t('product_bought', { quantity, product: t(product.name) })
  });
};
