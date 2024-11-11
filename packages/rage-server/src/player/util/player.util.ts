import { IPlayerTextBubble, PlayerSharedDataType } from '@bcrp-rage/common';
import { getForwardVector } from '../../util/vector3.util';


const textBubbleTimer: Map<number, NodeJS.Timeout> = new Map();

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


export const setPlayerTextBubble = (player: PlayerMp, bubble: IPlayerTextBubble | null) => {
  if (textBubbleTimer.has(player.id)) {
    const timeout = textBubbleTimer.get(player.id);

    if  (timeout)
      clearTimeout(timeout);

    textBubbleTimer.delete(player.id);
  }

  player.setVariable(PlayerSharedDataType.TextBubble, bubble);

  if (bubble) {
    const timer = setTimeout(() => {
      player.setVariable(PlayerSharedDataType.TextBubble, null);
      textBubbleTimer.delete(player.id);
    }, bubble.duration);

    textBubbleTimer.set(player.id, timer);
  }
};


export const p2pTeleport = (player: PlayerMp, target: PlayerMp) => {
  if (player.vehicle) {
    player.dimension = target.dimension;

    player.vehicle.dimension = target.dimension;
    player.vehicle.position = getForwardVector(target.position, target.heading, target.vehicle ? 3 : 2);
    const occupants = player.vehicle.getOccupants().entries();

    for (const [seat, occupant] of occupants) {
      occupant.dimension = target.dimension;
      occupant.putIntoVehicle(player.vehicle, seat);
    }
  } else {
    player.position = getForwardVector(target.position, target.heading, 2);
    player.dimension = target.dimension;
  }
};
