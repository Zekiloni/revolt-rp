import { getScreenResolution } from '../util/game.util';
import { getDistance } from '../util/vector.util';

mp.nametags.enabled = false;

export const showNameTags = true;

const nameTagsConfig = {
  MAX_PLAYER_DISTANCE: 10.0,
  SHOW_IN_VEHICLE: true
};

function nameTagHandler() {
  const { position } = mp.players.local;

  if (showNameTags) {
    mp.players.forEachInRange(mp.players.local.position, nameTagsConfig.MAX_PLAYER_DISTANCE,
      (target) => {
        const { position: tPosition } = target;
        const distance = getDistance(position, tPosition);

        const screenResolution = getScreenResolution();

        if (distance < nameTagsConfig.MAX_PLAYER_DISTANCE && mp.players.local.id != target.id) {
          if (mp.players.local.hasClearLosTo(target.handle, 17)) {
            if (target.getAlpha() != 0) {
              const boneIndex = target.getBoneIndex(RageEnums.Ped.Bones.IK_HEAD);
              const bonePosition = target.getWorldPositionOfBone(boneIndex);

              const screenPos = mp.game.graphics.world3dToScreen2d(bonePosition);

              if (screenPos) {
                const { x, y } = screenPos;

                let scale = (distance / 25);
                if (scale < 0.6) scale = 0.6;

                let offsetY = y;
                offsetY -= (scale * (0.005 * (screenResolution.y / 1080))) - parseInt('0.010');

                mp.game.graphics.drawText(`${target.name} [${target.id}]`, [x, offsetY], {
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
