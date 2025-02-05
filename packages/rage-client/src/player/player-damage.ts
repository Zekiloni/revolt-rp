import { triggerServer } from '@libertymp/rage-rpc';
import { IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { getIsAlive } from './util/player-data.util';

function incomingDamageHandler(
  sourceEntity: EntityMp,
  sourcePlayer: PlayerMp,
  targetEntity: EntityMp,
  weapon: number,
  boneIndex: number,
  damage: number
) {
  if (sourceEntity.type === 'player' && sourcePlayer) {
    if (targetEntity.type === 'player') {
      const target = targetEntity as PlayerMp;

      if (target.remoteId === mp.players.local.remoteId) {
        const playerDamage: IPlayerDamageData<PlayerMp> = {
          source: sourcePlayer,
          weapon,
          boneIndex,
          damage
        };
        triggerServer(ProcedureKey.SERVER_PLAYER_GET_DAMAGE, playerDamage);
      }
    }
  }
}

function outgoingDamageHandler(
  sourceEntity: EntityMp,
  targetEntity: EntityMp,
  targetPlayer: PlayerMp,
  weapon: number,
  boneIndex: number,
  damage: number) {

  mp.gui.chat.push(`[DEBUG] Outgoing - dealt ${damage} damage to ${targetPlayer.name}`);
  mp.gui.chat.push(`[DEBUG] Outgoing - dealt ${damage} to sourceEntity ${sourceEntity.type}`);

  if (sourceEntity.type === 'player') {
    mp.gui.chat.push(`[DEBUG] Outgoing - dealt ${damage} to targetEntity ${targetEntity.type}`);
  }

  // todo cancel dmg if already dead
  //mp.game.weapon.cancelCurrentDamageEvent();

  // todo check has armour and reduce damage
}

mp.events.add({
  incomingDamage: incomingDamageHandler,
  outgoingDamage: outgoingDamageHandler
});
