export const findPlayer = (nameOrId: string): PlayerMp | undefined => {
  if (!Number.isNaN(+nameOrId))
    return mp.players.at(+nameOrId);

  nameOrId = nameOrId.replace(' ', '_').toLowerCase();

  return mp.players.toArray()
    .find((player) => player.name.toLowerCase().includes(nameOrId) || player.name.toLowerCase() === nameOrId);
};

export const sendProximityMessage = function(message: string, position: Vector3, radius: number, colors: string[]) {
  const distanceGap = radius / (colors.length + 1);

  const distanceThresholds = colors.map((_color, index) => distanceGap * (index + 1));

  mp.players.forEachInRange(position, radius, (target) => {
    const distance = target.dist(position);
    let color = colors[0];

    for (let i = 0; i < distanceThresholds.length; i++) {
      if (distance <= distanceThresholds[i]) {
        color = colors[i];
        break;
      }
    }

    target.outputChatBox(`!{${color}}${message}`);
  });
};
