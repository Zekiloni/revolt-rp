import { getDistance } from '../util/vector.util';
import { isHudActive } from '../player/player-hud';
import { getIsAfk } from '../player/util/player-data.util';


mp.nametags.enabled = false;

const screenRes = mp.game.graphics.getScreenResolution();

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

              const screenPos = mp.game.graphics.world3dToScreen2d(new mp.Vector3(bonePosition.x, bonePosition.y, bonePosition.z + 0.4));

              if (screenPos) {
                const { x: screenX, y: screeny } = screenPos;

                let y = screeny;

                let scale: number = distance / 25;
                if (scale < 0.6) scale = 0.6;

                y -= scale * (0.005 * (screenRes.y / 1080)) - parseInt('0.010');

                mp.game.graphics.drawText(`${target.name} [${target.remoteId}]`, [screenX, y], {
                  centre: true,
                  font: 4,
                  color: [255, 255, 255, 180],
                  scale: [0.325, 0.325],
                  outline: false
                });

                if (target.isTypingInTextChat) {
                  mp.game.graphics.drawText(
                    "...",
                    [screenX, y - 0.042],
                    {
                      font: 4,
                      color: [238, 198, 80, 255],
                      scale: [0.325, 0.325],
                      outline: false
                    }
                  );
                }

                if (getIsAfk(target)) {
                  mp.game.graphics.drawText(
                    "(( AFK ))",
                    [screenX, y - 0.052],
                    {
                      centre: true,
                      font: 4,
                      color: [139, 139, 139, 200],
                      scale: [0.325, 0.325],
                      outline: false
                    }
                  );
                }
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
