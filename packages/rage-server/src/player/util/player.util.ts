export const findPlayer = (nameOrId: string): PlayerMp | undefined => {
  if (!Number.isNaN(+nameOrId))
    return mp.players.at(+nameOrId);

  nameOrId = nameOrId.replace(' ', '_').toLowerCase();

  return mp.players.toArray()
    .find((player) => player.name.toLowerCase().includes(nameOrId) || player.name.toLowerCase() === nameOrId);
};

export const sendProximityMessage = function(message: string, position: Vector3, radius: number, colors: string[]) {
  mp.players.forEachInRange(position, radius, (target) => {
    const distanceGap = radius / (colors.length + 1);
    const distance = target.dist(position);

    const colorIndex = colors.findIndex((_color, index) => {
      const distanceThreshold = distanceGap * (index + 1);
      return distance <= distanceThreshold;
    });

    const color = (colorIndex >= 0) ? colors[colorIndex] : colors[0];

    target.outputChatBox(`!{${color}}${message}`);
  });
};
