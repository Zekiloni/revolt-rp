import { t } from 'i18next';
import { triggerBrowsers, triggerClient } from '@libertymp/rage-rpc';
import {
  AdminType,
  CommandCategory,
  GameUiKey,
  hexColors, isIpv4,
  isNumber,
  PlayerSharedDataType,
  ProcedureKey,
  PropertyPointType,
  WeatherType,
  WeatherTypes
} from '@revolt-rp/common';
import { clearPlayerInventory, playerGiveItem, removePlayerWeapons } from '../inventory/player-inventory.service';
import { giveMoney, revivePlayer, setMoney, setPlayerHealth } from '../character/character.service';
import {
  createTemporaryVehicle,
  deleteVehicle, isTemporaryVehicle,
  setVehicleOwner, teleportPlayerToVehicle,
  toggleVehicleEditMenu
} from '../../vehicle/vehicle.service';
import { getAllBaseItemModels, isValidItem } from '../../item/registry/item-registry.util';
import {
  createPlayerConfirmation,
  findPlayer,
  freezePlayer,
  showPlayerGameInterface,
  teleportPlayerToPlayer
} from '../util/player.util';
import { destroyItem, getNearbyItem } from '../../item/item.service';
import { setWeather, toggleSnow } from '../../world/weather.service';
import { setAdministrator, setMutedUntil } from '../account/account.service';
import { registerCommand } from '../player-command.service';
import { notifyPlayer } from '../util/player-notify.util';
import {
  deleteOrganization,
  getOrganizationByName,
  makePlayerOrganization,
  makePlayerOrganizationLeader,
  unsetPlayerOrganization
} from '../../organization/organization.service';
import { banIp, banPlayer, kickPlayer, unbanIp } from './moderation/moderation.service';
import dayjs from 'dayjs';
import { isPlayerInVehicleCommandValidator } from '../../vehicle/vehicle.util';
import {
  destroyProperty,
  fillPropertyStock,
  getClosestProperty,
  getPropertyByName
} from '../../property/property.service';
import { savePlayerPosition } from '../../util/save-position.util';
import { playAnimation, stopAnimation } from '../util/player-animation.util';
import { sendAdminChatMessage } from './player-admin.util';


registerCommand({
  name: 'aduty',
  description: 'aduty',
  administrator: AdminType.MODERATOR,
  handle(player: PlayerMp) {
    player.setVariable(PlayerSharedDataType.AdminDuty, !player.getVariable<boolean>(PlayerSharedDataType.AdminDuty));
  }
});


registerCommand({
  name: 'createvehicle',
  description: 'temporary veh',
  aliases: ['veh'],
  administrator: AdminType.ADMINISTRATOR,
  params: ['model', 'primary color', 'secondary color'],
  handle(player: PlayerMp, model: string, primaryColor: string, secondaryColor: string) {
    const vehicle = createTemporaryVehicle(model, player.position, parseInt(primaryColor), parseInt(secondaryColor), { admin: true });
    setVehicleOwner(vehicle, player.character);
    player.putIntoVehicle(vehicle, RageEnums.VehicleSeat.DRIVER);
  }
});

registerCommand({
  name: 'destroyveh',
  description: 'todo',
  aliases: ['dv', 'deleteveh', 'deletevehicle'],
  administrator: AdminType.SENIOR_ADMIN,
  async handle(player: PlayerMp, ...args) {
    const vehicle = player.vehicle ?? mp.vehicles.getClosest(player.position, 1)[0];
    if (vehicle) {
      if (isTemporaryVehicle(vehicle)) {
        await deleteVehicle(vehicle);
      } else {
        const confirmed = await createPlayerConfirmation(player, {});
        if (confirmed && vehicle) {
          await deleteVehicle(vehicle);
        }
      }
    }
  }
});

registerCommand({
  name: 'eject',
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (target.vehicle) {
      target.removeFromVehicle();
      // todo: logging, messaging
    }
  }
});

registerCommand({
  name: 'gotoveh',
  description: 'todo',
  aliases: ['gv', 'gotovehicle'],
  params: ['vehicle id'],
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, vehicleId: string) {
    const vehicle = mp.vehicles.at(parseInt(vehicleId));
    if (vehicle) {
      teleportPlayerToVehicle(player, vehicle);
    } else {
      notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('vehicle_not_found') });
    }
  }
});

registerCommand({
  name: 'editvehicle',
  description: 'todo',
  administrator: AdminType.SENIOR_ADMIN,
  validators: [isPlayerInVehicleCommandValidator],
  handle(player: PlayerMp) {
    toggleVehicleEditMenu(player, player.vehicle);
  }
});

registerCommand({
  name: 'fixveh',
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  validators: [isPlayerInVehicleCommandValidator],
  handle(player: PlayerMp) {
    player.vehicle.repair();
  }
});


registerCommand({
  name: 'flipveh',
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  validators: [isPlayerInVehicleCommandValidator],
  handle(player: PlayerMp) {
    player.vehicle.rotation = new mp.Vector3(0, 0, player.vehicle.rotation.z);
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
    const adminLevel = t('admin_level', { returnObjects: true }) as string[];
    mp.players.broadcast(`!{${hexColors.ADMIN}}${adminLevel[player.account.administrator]} ${player.account.username}: ${content}`);
  }
});

registerCommand({
  name: 'a',
  aliases: ['adminchat', 'ac'],
  params: ['message'],
  description: 'todo',
  administrator: AdminType.MODERATOR,
  handle(player: PlayerMp, ...args) {
    const content = [...args].join(' ');
    sendAdminChatMessage(player, content);
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

    // TODO: messages & logging
  }
});


registerCommand({
  name: 'freeze',
  params: ['target'],
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  async handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    freezePlayer(target, !player.getVariable(PlayerSharedDataType.Frozen));
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
  name: 'xyz',
  aliases: ['gotopos'],
  description: 'todo',
  params: ['x', 'y', 'z'],
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, x: string, y: string, z: string) {
    player.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
  }
});

registerCommand({
  name: 'setdimension',
  aliases: ['setdim'],
  description: 'todo',
  params: ['dimension'],
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, targetQuery: string, dimension: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (!isNumber(dimension))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'dimension', type: 'number' })
      });

    player.dimension = parseInt(dimension);
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
  name: 'destroyitem',
  description: 'todo',
  async handle(player: PlayerMp) {
    const closestItem = await getNearbyItem(player, 2);
    if (closestItem) {
      await destroyItem(closestItem);
    }

    // TODO: messages, logging
  }
});


registerCommand({
  name: 'clearinventory',
  params: ['target'],
  description: 'todo',
  administrator: AdminType.SUPER_ADMIN,
  async handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    await clearPlayerInventory(target);
    // TODO: messages, logging
  }
});

registerCommand({
  name: 'disarm',
  params: ['target'],
  description: 'todo',
  administrator: AdminType.SENIOR_ADMIN,
  async handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    await removePlayerWeapons(target);
    // TODO: messages, logging
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
  params: ['weather', 'freeze (0,1)'],
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, weather: string, freeze: string) {
    if (!Object.values(WeatherTypes).includes((<WeatherType>weather))) {
      return player.outputChatBox('Invalid weather type.');
    }

    const freezeValue = parseInt(freeze, 10);
    if (![0, 1].includes(freezeValue)) {
      return player.outputChatBox('Freeze should be 0 (false) or 1 (true).');
    }

    setWeather((weather.toUpperCase() as RageEnums.Weather), freezeValue === 1);
  }
});


registerCommand({
  name: 'togglesnow',
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  handle(_player: PlayerMp) {
    toggleSnow();
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
    // TODO: messages, logging
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
});

registerCommand({
  name: 'revive',
  params: ['target'],
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    revivePlayer(target, target.position);
  }
});


registerCommand({
  name: 'sethealth',
  params: ['target', 'health'],
  description: 'todo',
  aliases: ['sethp'],
  administrator: AdminType.ADMINISTRATOR,
  handle(player: PlayerMp, targetQuery: string, amount: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.account)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (!isNumber(amount))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'hour', type: 'number' })
      });

    setPlayerHealth(target, parseInt(amount));
  }
});


registerCommand({
  name: 'dajmiadmina',
  description: 'das sebi admina sta nije jasno, ova komanda se brise',
  async handle(player: PlayerMp) {
    player.account.administrator = AdminType.SUPER_ADMIN;
    await player.account.save();
  }
});


registerCommand({
  name: 'setclothes',
  description: 'test',
  administrator: AdminType.ADMINISTRATOR,
  params: ['component', 'drawable', 'texture'],
  handle(player: PlayerMp, component: string, drawable: string, texture: string) {
    player.setClothes(parseInt(component), parseInt(drawable), parseInt(texture), 2);
  }
});


registerCommand({
  name: 'setmodel',
  description: 'todo',
  administrator: AdminType.ADMINISTRATOR,
  params: ['target', 'model'],
  handle(player: PlayerMp, targetQuery: string, model: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    player.model = mp.joaat(model);
  }
});

registerCommand({
  name: 'createorganization',
  aliases: ['createorg', 'createfaction'],
  description: 'todo',
  administrator: AdminType.SUPER_ADMIN,
  handle(player: PlayerMp) {
    showPlayerGameInterface(player, GameUiKey.CreateOrganization);
  }
});

registerCommand({
  name: 'makeleader',
  aliases: ['setleader'],
  params: ['target', 'organization name'],
  description: 'todo',
  administrator: AdminType.SUPER_ADMIN,
  async handle(player: PlayerMp, targetQuery: string, organizationName: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    const organization = await getOrganizationByName(organizationName, organizationName);

    if (!organization)
      return notifyPlayer(player, { severity: 'error', detail: t('organization_not_found') });

    await makePlayerOrganizationLeader(target, organization);
    notifyPlayer(player, {
      severity: 'info',
      detail: t('player_made_leader', { player: target.name, organization: organization.name })
    });
  }
});


registerCommand({
  name: 'setorganization',
  aliases: ['setorg', 'setfaction'],
  params: ['target', 'organization name'],
  description: t('set_organization_command_description'),
  administrator: AdminType.SUPER_ADMIN,
  async handle(player: PlayerMp, targetQuery: string, organizationName: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    const organization = await getOrganizationByName(organizationName, organizationName);

    if (!organization)
      return notifyPlayer(player, { severity: 'error', detail: t('organization_not_found') });

    await makePlayerOrganization(target, organization);
    notifyPlayer(player, {
      severity: 'info',
      detail: t('player_made_member', { player: target.name, organization: organization.name })
    });
  }
});


registerCommand({
  name: 'unsetorganization',
  aliases: ['unsetorg', 'unsetfaction'],
  params: ['target'],
  description: t('unset_organization_command_description'),
  administrator: AdminType.SUPER_ADMIN,
  async handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (!target.character.membership)
      return notifyPlayer(player, { severity: 'error', detail: t('player_not_in_organization') });

    await unsetPlayerOrganization(target);

    notifyPlayer(player, { severity: 'info', detail: t('player_removed_from_organization', { player: target.name }) });
  }
});


registerCommand({
  name: 'deleteorganization',
  aliases: ['deleteorg', 'deletefaction'],
  params: ['organization name'],
  description: t('delete_organization_command_description'),
  administrator: AdminType.SUPER_ADMIN,
  async handle(player: PlayerMp, organizationName: string) {
    const organization = await getOrganizationByName(organizationName, organizationName);

    if (!organization)
      return notifyPlayer(player, { severity: 'error', detail: t('organization_not_found') });


    await deleteOrganization(organization);
    notifyPlayer(player, { severity: 'info', detail: t('organization_deleted', { organization: organization.name }) });
  }
});

registerCommand({
  name: 'fly',
  aliases: ['noclip'],
  description: 'todo',
  administrator: AdminType.SENIOR_ADMIN,
  handle(player: PlayerMp) {
    triggerClient(player, ProcedureKey.CLIENT_PLAYER_TOGGLE_NO_CLIP);
  }
});


registerCommand({
  name: 'kick',
  params: ['target', 'reason'],
  description: 'todo',
  administrator: AdminType.MODERATOR,
  async handle(player: PlayerMp, targetQuery: string, reason: string) {
    const target = findPlayer(targetQuery);

    if (!target)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    await kickPlayer(target, reason, player);
    notifyPlayer(player, { severity: 'info', detail: t('player_kicked', { player: target.name }) });
  }
});

registerCommand({
  name: 'ban',
  params: ['target', 'reason', 'days || perm'],
  description: 'todo',
  administrator: AdminType.MODERATOR,
  async handle(player: PlayerMp, targetQuery: string, reason: string, expire: string) {
    if (!isNumber(expire) && expire != 'perm')
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'expire', type: 'number' })
      });

    const target = findPlayer(targetQuery);

    if (!target)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    let expiringAt: Date | undefined = undefined;
    if (expire != 'perm') {
      expiringAt = dayjs().add(parseInt(expire), 'day').toDate();
    }

    await banPlayer(target, reason, expiringAt, player);
    notifyPlayer(player, { severity: 'info', detail: t('player_banned', { player: target.name }) });
  }
});

registerCommand({
  name: 'mute',
  params: ['target', 'minutes'],
  description: 'todo',
  administrator: AdminType.MODERATOR,
  async handle(player: PlayerMp, targetQuery: string, minutes: string) {
    if (!isNumber(minutes))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'minutes', type: 'number' })
      });

    const target = findPlayer(targetQuery);

    if (!target)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    const mutedUntil = dayjs().add(parseInt(minutes), 'minute').toDate();
    target.setVariable(PlayerSharedDataType.MutedUntil, mutedUntil.toISOString());
    target.account.mutedUntil = mutedUntil;
    await target.account.save();

    notifyPlayer(player, { severity: 'info', detail: t('player_muted', { player: target.name, minutes }) });
  }
})

registerCommand({
  name: 'unmute',
  params: ['target'],
  description: 'todo',
  administrator: AdminType.MODERATOR,
  async handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    await setMutedUntil(target, null);
    notifyPlayer(player, { severity: 'info', detail: t('player_unmuted', { player: target.name }) });
  }
})

registerCommand({
  name: 'spec',
  aliases: ['spectate'],
  params: ['target'],
  description: 'todo',
  administrator: AdminType.MODERATOR,
  async handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (target.id === player.id)
      return notifyPlayer(player, { severity: 'error', detail: t('cannot_spectate_yourself') });

    const spectating = player.isSpectating ?? false;
    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_SPECTATE, spectating ? null : target.id);
    player.isSpectating = !spectating;
  }
});

registerCommand({
  name: 'banip',
  params: ['ip address', 'reason', 'days || perm'],
  description: 'todo',
  administrator: AdminType.SUPER_ADMIN,
  async handle(player: PlayerMp, ipAddress: string, reason: string, expire: string) {
    if (!isIpv4(ipAddress))
      return notifyPlayer(player, { severity: 'error', detail: t('invalid_ip_address') });

    if (!isNumber(expire) && expire != 'perm')
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'expire', type: 'number' })
      });

    let expiringAt: Date | undefined = undefined;
    if (expire != 'perm') {
      expiringAt = dayjs().add(parseInt(expire), 'day').toDate();
    }

    await banIp(ipAddress, reason, expiringAt, player);
    notifyPlayer(player, { severity: 'info', detail: t('ip_banned', { ip: ipAddress }) });
  }
});

registerCommand({
  name: 'unbanip',
  params: ['ip address'],
  description: 'todo',
  administrator: AdminType.SUPER_ADMIN,
  async handle(player: PlayerMp, ipAddress: string) {
    if (!isIpv4(ipAddress))
      return notifyPlayer(player, { severity: 'error', detail: t('invalid_ip_address') });

    await unbanIp(ipAddress, player);
  }
});

registerCommand({
  name: 'createproperty',
  description: 'todo',
  administrator: AdminType.SENIOR_ADMIN,
  handle(player: PlayerMp) {
    showPlayerGameInterface(player, GameUiKey.CreateProperty);
  }
});

registerCommand({
  name: 'refillstock',
  category: CommandCategory.Admin,
  description: t('refill_stock_command_description'),
  params: ['quantity', 'name'],
  administrator: AdminType.SENIOR_ADMIN,
  async handle(player: PlayerMp, quantity: string, ...name: string[]) {
    if (!isNumber(quantity))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'quantity', type: 'number' })
      });

    const property = await getPropertyByName(name.join(' '));

    if (!property)
      return notifyPlayer(player, { severity: 'error', detail: t('property_not_found') });

    await fillPropertyStock(property, parseInt(quantity));
    notifyPlayer(player, { severity: 'info', detail: t('property_stock_filled') });
  }
});


registerCommand({
  name: 'editproperty',
  description: 'todo',
  params: ['name'],
  administrator: AdminType.SENIOR_ADMIN,
  async handle(player: PlayerMp, ...args) {
    const name = args.join(' ');

    const property = await getPropertyByName(name);

    if (!property)
      return notifyPlayer(player, { severity: 'error', detail: t('property_not_found') });

    showPlayerGameInterface(player, GameUiKey.ManageProperty,
      () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_PROPERTY, property));
  }
});

registerCommand({
  name: 'deleteproperty',
  aliases: ['destroyproperty'],
  description: 'todo',
  administrator: AdminType.SENIOR_ADMIN,
  async handle(player: PlayerMp) {
    const property = await getClosestProperty(player.position, player.dimension, PropertyPointType.MainPoint);

    if (!property)
      return notifyPlayer(player, { severity: 'error', detail: t('property_not_found') });

    await destroyProperty(property);

    notifyPlayer(player, { severity: 'info', detail: t('property_deleted') });
  }
});


registerCommand({
  name: 'clearchat',
  aliases: ['cc'],
  description: 'todo',
  administrator: AdminType.MODERATOR,
  handle(_player: PlayerMp) {
    mp.players.forEach(target => {
      triggerBrowsers(target, ProcedureKey.BROWSER_CLEAR_CHAT);
      notifyPlayer(target, { severity: 'info', detail: t('chat_cleared_by_administrator') });
    });
  }
});


registerCommand({
  name: 'savepos',
  aliases: ['sp'],
  description: 'todo',
  administrator: AdminType.SUPER_ADMIN,
  handle(player: PlayerMp, ...args) {
    const name = (Array.isArray(args) && args.length > 0) ? args.join(' ') : 'Unknown';
    savePlayerPosition(player, name);
  }
});


registerCommand({
  name: 'screenshot',
  params: ['type (CLOTHING, PROP)'],
  description: 'todo',
  handle(player: PlayerMp, type: string, componentId?: string) {
    switch (type) {
      case 'CLOTHING' || 'PROP':
        triggerClient(player, ProcedureKey.CLIENT_SCREENSHOT_CLOTHING, [type, parseInt(componentId)]);
        break;

      case 'ITEM_OBJECTS':
        triggerClient(player, ProcedureKey.CLIENT_SCREENSHOT_ITEM_OBJECTS, getAllBaseItemModels());
    }
  }
});


registerCommand({
  name: 'playanim',
  description: 'todo',
  administrator: AdminType.SENIOR_ADMIN,
  handle(player: PlayerMp, dictionary: string, name: string, flag: string, duration: string = undefined) {
    if (!isNumber(flag))
      return;

    playAnimation(player, dictionary, name, parseInt(flag), duration ? parseInt(duration) : undefined);
  }
});

registerCommand({
  name: 'stopanim',
  description: 'todo',
  administrator: AdminType.SENIOR_ADMIN,
  handle(player: PlayerMp) {
    stopAnimation(player);
  }
});
