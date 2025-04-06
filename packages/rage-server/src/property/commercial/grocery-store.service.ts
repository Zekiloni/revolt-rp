import { triggerBrowsers } from '@libertymp/rage-rpc';
import { GameUiKey, IPayment, ICartItem, ProcedureKey, IProduct, PaymentType } from '@revolt-rp/common';
import { hidePlayerGameInterface, showPlayerGameInterface } from '../../player/util/player.util';
import { Property } from '../property.model';
import { getBaseItem } from '../../item/registry/util/item-registry.util';
import { playerGiveItem } from '../../player/inventory/player-inventory.service';
import { makeOnlinePayment } from '../../banking/banking.service';
import { notifyPlayer } from '../../player/util/player-notify.util';
import { t } from 'i18next';
import { giveMoney } from '../../player/character/character.service';
import { calculateTaxRate } from '../../economy/economy.util';


export const toggleGroceryStoreMenu = (player: PlayerMp, property: Property) => {
  showPlayerGameInterface(player, GameUiKey.GroceryStore, () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_PROPERTY, property));
};


const calculateTotalCartPrice = (cartItems: ICartItem<string>[], catalog: IProduct[]) => {
  return cartItems.reduce(
    (total, item) => {
      const product = catalog.find(product => product.name === item.product);
      const discount = product.discount !== undefined ? product.discount : 0;
      return total + (item.quantity * product.price * (1 - discount));
    }, 0);
};

export const buyGroceries = async (player: PlayerMp, property: Property, cartItems: ICartItem<string>[], payment: IPayment) => {
  const total = calculateTotalCartPrice(cartItems, property.catalog);

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

  for (const item of cartItems) {
    const product = property.catalog.find(product => product.name === item.product);

    if (!product) {
      notifyPlayer(player, { severity: 'error', detail: t('product_not_found', { product: t(product.name) }) });
      continue;
    }

    const baseItem = getBaseItem(product.name);

    if (!baseItem) {
      continue;
    }

    if (baseItem.isStackable) {
      await playerGiveItem(player, baseItem.name, item.quantity);
    } else {
      for (let i = 0; i < item.quantity; i++) {
        await playerGiveItem(player, baseItem.name, 1);
      }
    }

    if (product.stock < item.quantity) {
      notifyPlayer(player, { severity: 'error', detail: t('product_out_of_stock', { product: t(product.name) }) });
      continue;
    }

    product.stock = product.stock - item.quantity;
    notifyPlayer(player, { severity: 'info', detail: t('product_bought', { quantity: item.quantity, product: t(product.name) }) });
  }

  property.markModified('catalog');
  await property.save();

  hidePlayerGameInterface(player, GameUiKey.GroceryStore);
};
