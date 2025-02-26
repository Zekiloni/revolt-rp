import { triggerBrowsers } from '@libertymp/rage-rpc';
import { GameUiKey, ProcedureKey } from '@revolt-rp/common';
import { showPlayerGameInterface } from '../../util/player-notify.util';
import { getAccountByQuery } from '../../account/account.service';
import { Ban, BanModel } from './ban.model';
import { Account } from '../../account/account.model';
import { KickModel } from './kick.model';
import { t } from 'i18next';
import { sendAdminAlert } from '../player-admin.util';


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
  showPlayerGameInterface(player, GameUiKey.BanInfo, () => triggerBrowsers(player, ProcedureKey.BROWSER_SET_BAN_INFO, ban));
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
    player.kick(activeBan.reason);
  }
};


export const banPlayer = async (player: PlayerMp, reason: string, expiringAt: Date | undefined, admin?: PlayerMp) => {
  const ban = await createBan(player.account, player.ip, reason, expiringAt, admin?.account);
  showPlayerBanInfo(player, ban);
  sendAdminAlert(t('player_kick_alert', {
    player: player.name,
    admin: admin ? admin.account.username : 'System',
    reason
  }));
  player.kick(reason);
};


export const kickPlayer = async (player: PlayerMp, reason: string, admin?: PlayerMp) => {
  if (player.account)
    await createKick(player.account, reason, admin?.account);

  player.kick(reason);
};
