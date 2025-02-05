import { triggerServer } from '@libertymp/rage-rpc';
import { IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';

function incomingDamageHandler(
  sourceEntity: EntityMp,
  sourcePlayer: PlayerMp,
  targetEntity: EntityMp,
  weaponHash: number,
  boneIndex: number,
  damage: number
) {
  if (sourceEntity.type === 'player' && sourcePlayer) {
    if (targetEntity.type === 'player') {
      const target = targetEntity as PlayerMp;

      if (target.remoteId === mp.players.local.remoteId) {
        const playerDamage: IPlayerDamageData<PlayerMp> = {
          source: sourcePlayer,
          weaponHash,
          boneIndex,
          damage
        };
        triggerServer(ProcedureKey.SERVER_PLAYER_DAMAGE, playerDamage);
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
