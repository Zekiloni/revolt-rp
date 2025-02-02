import { getDistance } from '../util/vector.util';
import { isHudActive } from '../player/player-hud';

mp.nametags.enabled = false;


const nameTagsConfig = {
  MAX_PLAYER_DISTANCE: 10.0,
  SHOW_IN_VEHICLE: true
};

function nameTagHandler() {
  const { position } = mp.players.local;

  if (isHudActive) {
    mp.players.forEachInRange(mp.players.local.position, nameTagsConfig.MAX_PLAYER_DISTANCE,
      (target) => {
        const { position: tPosition } = target;
        const distance = getDistance(position, tPosition);

        if (distance < nameTagsConfig.MAX_PLAYER_DISTANCE && mp.players.local.id != target.id) {
          if (mp.players.local.hasClearLosTo(target.handle, 17)) {
            if (target.getAlpha() != 0) {
              const boneIndex = target.getBoneIndex(RageEnums.Ped.Bones.IK_HEAD);
              const bonePosition = target.getWorldPositionOfBone(boneIndex);

              const screenPos = mp.game.graphics.world3dToScreen2d(bonePosition);

              if (screenPos) {
                const { x, y } = screenPos;

                mp.game.graphics.drawText(`${target.name} [${target.remoteId}]`, [x, y - 0.1], {
                  centre: true,
                  font: 4,
                  color: [255, 255, 255, 255],
                  scale: [0.4, 0.4],
                  outline: false
                });
              }
            }
          }
        }
      }
    );
  }
}

mp.events.add({
  render: nameTagHandler
});
