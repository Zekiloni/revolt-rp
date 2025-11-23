import { triggerBrowsers } from '@libertymp/rage-rpc';
import { GameUiKey, ICartItem, IPayment, IProduct, PaymentType, ProcedureKey } from '@revolt-rp/common';
import { hidePlayerGameInterface, showPlayerGameInterface } from '../../player/util/player.util';
import { Property } from '@revolt-rp/core';
import { processCartItem, processPayment } from './purchase.handler';


export function toggleGroceryStoreMenu (player: PlayerMp, property: Property) {
  showPlayerGameInterface(player, GameUiKey.GroceryStore, () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_PROPERTY, property));
}


const calculateTotalCartPrice = (cartItems: ICartItem<string>[], catalog: IProduct[]) => {
  return cartItems.reduce(
    (total, item) => {
      const product = catalog.find(product => product.name === item.product);
      const discount = product.discount !== undefined ? product.discount : 0;
      return total + (item.quantity * product.price * (1 - discount));
    }, 0);
};

export const buyGroceries = async (player: PlayerMp, property: Property, cartItems: ICartItem<string>[], payment: IPayment) => {
  const totalAmount = calculateTotalCartPrice(cartItems, property.catalog);
  const isBankCardPayment = payment.type === PaymentType.BankCard && !!payment.bankAccountNo;

  const paymentSucceeded = await processPayment(player, property, totalAmount, payment, isBankCardPayment);
  if (!paymentSucceeded) {
    return;
  }

  for (const cartItem of cartItems) {
    await processCartItem(player, property, cartItem.product, cartItem.quantity);
  }

  property.markModified('catalog');
  await property.save();

  hidePlayerGameInterface(player, GameUiKey.GroceryStore);
};
