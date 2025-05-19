import { triggerClient } from '@libertymp/rage-rpc';
import {
  IClothingCartItem,
  ICartItem,
  IPayment,
  ProcedureKey,
  PaymentType,
  IProduct,
  IClothingProduct
} from '@revolt-rp/common';
import { Property } from '../property.model';
import { makeOnlinePayment } from '../../banking/banking.service';
import { notifyPlayer } from '../../player/util/player-notify.util';
import { t } from 'i18next';
import { giveMoney } from '../../player/character/character.service';
import { calculateTaxRate } from '../../economy/economy.util';
import { getBaseItem } from '../../item/registry/item-registry.util';
import { playerGiveItem } from '../../player/inventory/player-inventory.service';


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

export const buyClothes = async (player: PlayerMp, property: Property, cartItems: IClothingCartItem[], payment: IPayment) => {
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
    const product = property.catalog.find(product => product.id === item.product.id);

    if (!product) {
      notifyPlayer(player, { severity: 'error', detail: t('product_not_found', { product: t(product.name) }) });
      continue;
    }

    const baseItem = getBaseItem(product.name);

    if (!baseItem) {
      continue;
    }

    if (baseItem.isStackable) {
      await playerGiveItem(player, baseItem.name, item.quantity, {
        wearableInfo: {
          model: player.model === RageEnums.Hashes.Ped.MP_M_FREEMODE_01 ? 'mp_m_freemode_01' : 'mp_f_freemode_01',
          drawable: item.drawable,
          texture: item.texture,
          palette: 0
        }
      });
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
    notifyPlayer(player, {
      severity: 'info',
      detail: t('product_bought', { quantity: item.quantity, product: t(product.name) })
    });
  }

  property.markModified('catalog');
  await property.save();

  await toggleClothingStoreMenu(player, null);
};
