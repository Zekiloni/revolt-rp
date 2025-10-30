import { Ban, Kick } from '@revolt-rp/core';
import { IAccount } from '@revolt-rp/common';



export const mapKickToModerationLog = (kick: Kick) => {
  return {
    type: 'kick',
    reason: kick.reason,
    admin: kick.admin ? (<IAccount>kick.admin).username : 'system',
    createdAt: kick.createdAt
  }
}

export const mapBanToModerationLog = (ban: Ban)=> {
  return {
    type: 'ban',
    reason: ban.reason,
    admin: ban.admin ? (<IAccount>ban.admin).username : 'system',
    createdAt: ban.createdAt,
    expiringAt: ban.expiringAt
  }
}
