import { triggerClient } from '@libertymp/rage-rpc';
import { t } from 'i18next';
import { ProcedureKey } from '@revolt-rp/common';
import { getAccountByQuery } from '../../account/account.service';
import { Account } from '../../account/account.model';
import { sendAdminAlert } from '../player-admin.util';
import { Ban, BanModel } from './ban.model';
import { KickModel } from './kick.model';


const BAN_KICK_TIMEOUT_MS = 2500;

export const createKick = (account: Account, reason: string, admin?: Account) => {
  return KickModel.create({
    account, reason, admin
  });
};

export const createBan = (account: Account | undefined, ipAddress: string, reason: string, expiringAt: Date | undefined, admin?: Account) => {
  return BanModel.create({
    account, reason, expiringAt, admin, ipAddress
  });
};

export const showPlayerBanInfo = (player: PlayerMp, ban: Ban) => {
  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_BAN_INFO, ban);
};

export const checkPlayerBan = async (player: PlayerMp) => {
  const account = await getAccountByQuery({ $or: [{ socialClubId: player.rgscId }, { socialClubUsername: player.socialClub }] });

  const activeBan = await BanModel.findOne({
    $or: [
      account ? { account: account._id } : {},
      { ipAddress: player.ip }
    ],
    expiringAt: { $gt: new Date() },
    deletedAt: { $exists: false }
  }).populate('admin')
    .exec();
  if (activeBan) {
    showPlayerBanInfo(player, activeBan);
    kickPlayerWithTimeout(player, activeBan.reason);
    return activeBan;
  }
};

function kickPlayerWithTimeout(player: PlayerMp, reason: string) {
  setTimeout(() => {
    if (player && mp.players.exists(player))
      player.kick(reason);
  }, BAN_KICK_TIMEOUT_MS);
}

export const banPlayer = async (player: PlayerMp, reason: string, expiringAt: Date | undefined, admin?: PlayerMp) => {
  const ban = await createBan(player.account, player.ip, reason, expiringAt, admin?.account);
  showPlayerBanInfo(player, ban);
  sendAdminAlert(t('player_ban_alert', {
    player: player.name,
    admin: admin ? admin.account.username : 'System',
    reason
  }));

  player.alpha = 0;
  kickPlayerWithTimeout(player, ban.reason);
};

export const banIp = async (ipAddress: string, reason: string, expiringAt: Date | undefined, admin?: PlayerMp) => {
  const target = mp.players.toArray().find(e => e.ip === ipAddress);
  if (target && target.account) {
    return banPlayer(target, reason, expiringAt, admin);
  }

  await createBan(undefined, ipAddress, reason, expiringAt, admin?.account);
  sendAdminAlert(t('ip_ban_alert', {
    ip: ipAddress,
    admin: admin ? admin.account.username : 'System',
    reason
  }));
};


export const kickPlayer = async (player: PlayerMp, reason: string, admin?: PlayerMp) => {
  if (player.account)
    await createKick(player.account, reason, admin?.account);

  sendAdminAlert(t('player_kick_alert', { player: player.name, admin: admin ? admin.name : 'System', reason }));
  player.kick(reason);
};
