import { AdminType, hexColors } from '@bcrp-rage/common';
import { registerCommand } from '../player-command.service';
import { findPlayer, p2pTeleport } from '../util/player.util';
import { notifyPlayer } from '../util/player-notify.util';
import { t } from 'i18next';
import { setPlayerAdmin } from '../account/account.service';
import { getForwardVector } from '../../util/vector3.util';


// TODO: add admin
registerCommand({
  name: 'veh',
  description: 'temporary veh',
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
    // todo, extract into method, messaging
  }
});

