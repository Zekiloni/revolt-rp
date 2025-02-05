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

      mp.gui.chat.push(`[DEBUG] ${sourcePlayer.name} damaged ${target.name} with ${weapon} on bone ${boneIndex} for ${damage} damage`);
      if (target.remoteId === mp.players.local.remoteId) {
        mp.gui.chat.push(`[DEBUG] You (localPlayer) were damaged by ${sourcePlayer.name} with ${weapon} on bone ${boneIndex} for ${damage} damage`);
        mp.events.callRemote('playerDamage', sourcePlayer, targetEntity, weapon, boneIndex, damage);
      }
    }
  }
}

mp.events.add({
  incomingDamage: incomingDamageHandler
});
