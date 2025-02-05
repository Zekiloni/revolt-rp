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
        mp.events.callRemote('playerDamage', sourcePlayer, targetEntity, weapon, boneIndex, damage);
      }
    }
  }
}

mp.events.add({
  incomingDamage: incomingDamageHandler
});
