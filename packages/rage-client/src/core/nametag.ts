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
                  color: (Date.now() - target.lastDamageAt < 750) ? [255, 0, 0, 250] : [255, 255, 255, 250],
                  scale: [0.385, 0.385],
                  outline: false
                });

                if (target.isTypingInTextChat) {
                  mp.game.graphics.drawText(
                    "[. . .]",
                    [screenX, y - 0.037],
                    {
                      font: 4,
                      color: [238, 198, 80, 255],
                      scale: [0.435, 0.435],
                      outline: false
                    }
                  );
                }

                if (getIsAfk(target)) {
                  mp.game.graphics.drawText(
                    "AFK",
                    [screenX, y - 0.047],
                    {
                      centre: true,
                      font: 4,
                      color: [139, 139, 139, 200],
                      scale: [0.375, 0.375],
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
  render: nameTagHandler,
});
