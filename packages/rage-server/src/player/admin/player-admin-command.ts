import { t } from 'i18next';
import { AdminType, hexColors, isNumber } from '@bcrp-rage/common';
import { registerCommand } from '../player-command.service';
import { findPlayer, p2pTeleport } from '../util/player.util';
import { notifyPlayer } from '../util/player-notify.util';
import { setPlayerAdmin } from '../account/account.service';
import { isValidItem } from '../../item/registry/util/item-registry.util';
import { playerGiveItem } from '../inventory/player-inventory.service';


registerCommand({
  name: 'veh',
  description: 'temporary veh',
  administrator: AdminType.ADMINISTRATOR,
  params: ['model', 'primary color', 'secondary color'],
  handle(player: PlayerMp, model: string, primaryColor: string, secondaryColor: string) {
    const vehicle = mp.vehicles.new(mp.joaat(model), player.position);
    vehicle.setColor(parseInt(primaryColor), parseInt(secondaryColor));
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

    await setPlayerAdmin(target, parseInt(level));

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

    p2pTeleport(player, target);
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

    p2pTeleport(target, player);
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
