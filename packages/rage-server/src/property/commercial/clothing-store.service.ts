import { triggerClient } from '@libertymp/rage-rpc';
import {
  ICartItem,
  IClothingCartItem,
  IClothingProduct,
  IPayment,
  IProduct,
  PaymentType,
  ProcedureKey
} from '@revolt-rp/common';
import { Property } from '@revolt-rp/core';
import { processCartItem, processPayment } from './purchase.handler';


export const toggleClothingStoreMenu = async (player: PlayerMp, property: Property | null) => {
  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_CLOTHING_STORE, property);
};


const calculateTotalCartPrice = (cartItems: ICartItem<IClothingProduct>[], catalog: IProduct[]) => {
  return cartItems.reduce(
    (total, item) => {
      const product = catalog.find(product => product.id === item.product.id);
      const discount = product.discount !== undefined ? product.discount : 0;
      return total + (item.quantity * product.price * (1 - discount));
    }, 0);
};

export const buyClothes = async (
  player: PlayerMp,
  property: Property,
  cartItems: IClothingCartItem[],
  payment: IPayment
) => {
  const totalAmount = calculateTotalCartPrice(cartItems, property.catalog);
  const isBankCardPayment = payment.type === PaymentType.BankCard && !!payment.bankAccountNo;

  const paymentSucceeded = await processPayment(player, property, totalAmount, payment, isBankCardPayment);
  if (!paymentSucceeded) {
    return;
  }

  // Process each cart item - clothing stores use 'id' identifier and have wearableInfo
  for (const item of cartItems) {
    const wearableInfo = {
      model: player.model === RageEnums.Hashes.Ped.MP_M_FREEMODE_01 ? 'mp_m_freemode_01' as const : 'mp_f_freemode_01' as const,
      drawable: item.drawable,
      texture: item.texture,
      palette: 0
    };

    await processCartItem(player, property, item.product.name, item.quantity, { wearableInfo });
  }

  property.markModified('catalog');
  await property.save();
  await toggleClothingStoreMenu(player, null);
};
