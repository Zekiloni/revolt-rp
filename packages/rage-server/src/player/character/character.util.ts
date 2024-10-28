export const isCharacterDescriptionSet = (player: PlayerMp) =>
  player.character.description && player.character.description.length > 3;
