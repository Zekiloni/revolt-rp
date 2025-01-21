import { t } from 'i18next';
import { AdminType, hexColors, isNumber } from '@revolt-rp/common';
import { registerCommand } from '../player-command.service';
import { findPlayer, teleportPlayerToPlayer } from '../util/player.util';
import { notifyPlayer } from '../util/player-notify.util';
import { setAdministrator } from '../account/account.service';
import { isValidItem } from '../../item/registry/util/item-registry.util';
import { playerGiveItem } from '../inventory/player-inventory.service';
import { giveMoney, setMoney } from '../character/character.service';


registerCommand({
  name: 'createvehicle',
  description: 'temporary veh',
  aliases: ['veh'],
  administrator: AdminType.ADMINISTRATOR,
  params: ['model', 'primary color', 'secondary color'],
  handle(player: PlayerMp, model: string, primaryColor: string, secondaryColor: string) {
    const vehicle = mp.vehicles.new(mp.joaat(model), player.position);
    vehicle.setColor(parseInt(primaryColor), parseInt(secondaryColor));
    vehicle.engine = false;
    player.putIntoVehicle(vehicle, RageEnums.VehicleSeat.DRIVER);
  }
});


registerCommand({
  name: 'announce',
  aliases: ['ao'],
  params: ['message'],
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, ...args) {
    const content = [...args].join(' ');
    mp.players.broadcast(`!{${hexColors.LIGHT_PURPLE}}${player.account.username}: ${content}`);
  }
});

registerCommand({
  name: 'makeadmin',
  params: ['target', 'level'],
  description: 'todo',
  administrator: AdminType.SUPER_ADMIN,
  async handle(player: PlayerMp, targetQuery: string, level: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    await setAdministrator(target, parseInt(level));

    // tod
  }
});


registerCommand({
  name: 'goto',
  params: ['target'],
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  async handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    teleportPlayerToPlayer(player, target);
    // todo, extract into method, messaging
  }
});


registerCommand({
  name: 'gethere',
  params: ['target'],
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  async handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    teleportPlayerToPlayer(target, player);
    // todo: logging, messaging
  }
});


registerCommand({
  name: 'giveitem',
  params: ['target', 'quantity', 'item'],
  description: 'todo',
  async handle(player: PlayerMp, targetQuery: string, quantity: string, ...itemNameArr: string[]) {
    const itemName = itemNameArr.join(' ');

    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (!isNumber(quantity))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'quantity', type: 'number' })
      });

    if (!isValidItem(itemName))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('not_found'),
        detail: t('item_not_found', { name: itemName })
      });

    await playerGiveItem(target, itemName, parseInt(quantity));

    // todo: logging, message
  }
});


registerCommand({
  name: 'givemoney',
  params: ['target', 'amount'],
  description: 'todo',
  async handle(player: PlayerMp, targetQuery: string, amount: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (!isNumber(amount))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'amount', type: 'number' })
      });

    await giveMoney(target, parseInt(amount));
    // TODO: logging, message
  }
});


registerCommand({
  name: 'setmoney',
  params: ['target', 'amount'],
  description: 'todo',
  async handle(player: PlayerMp, targetQuery: string, amount: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (!isNumber(amount))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'amount', type: 'number' })
      });

    await setMoney(target, parseInt(amount));
    // TODO: logging, message
  }
});


registerCommand({
  name: 'setweather',
  params: ['weather'],
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, weather: string) {
    mp.world.weather = weather.toUpperCase();
  }
});

registerCommand({
  name: 'settime',
  params: ['hour'],
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, hour: string) {
    if (!isNumber(hour))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'hour', type: 'number' })
      });

    mp.world.time.hour = parseInt(hour);
  }
});



registerCommand({
  name: 'slap',
  params: ['target'],
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    target.position.z = target.position.z + 2.5;
  }
})
