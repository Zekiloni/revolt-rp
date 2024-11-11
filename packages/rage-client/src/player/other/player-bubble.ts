import { getScreenResolution } from '../../util/game.util';
import { getTextBubble } from '../util/player-data.util';

const TEXT_BUBBLE_RENDER_DISTANCE = 15;

function textBubbleRenderHandler() {
  const { position } = mp.players.local;

  mp.players.forEachInRange(mp.players.local.position, TEXT_BUBBLE_RENDER_DISTANCE,
    (target) => {
      const { position: targetPosition } = target;

      const distance = mp.game.gameplay.getDistanceBetweenCoords(
        position.x,
        position.y,
        position.z,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );

      const screenResolution = getScreenResolution();

      const textBubble = getTextBubble(target);

      if (textBubble && textBubble.content && textBubble.content.length) {
        if (distance < TEXT_BUBBLE_RENDER_DISTANCE && mp.players.local.id != target.id) {
          if (mp.players.local.hasClearLosTo(target.handle, 17)) {
            if (target.getAlpha() != 0) {
              const boneIndex = target.getBoneIndex(RageEnums.Ped.Bones.IK_HEAD);
              const bonePosition = target.getWorldPositionOfBone(boneIndex);

              const screenPos = mp.game.graphics.world3dToScreen2d(bonePosition);

              if (screenPos) {
                // eslint-disable-next-line prefer-const
                let { x, y } = screenPos;

                let scale = (distance / 25);
                if (scale < 0.6) scale = 0.6;

                y -= (scale * (0.005 * (screenResolution.y / 1080))) - parseInt('0.010');

                mp.game.graphics.drawText(textBubble.content, [x, y + 0.3], {
                  centre: true,
                  font: 4,
                  color: textBubble.color,
                  scale: [0.4, 0.4],
                  outline: false
                });
              }
            }
          }
        }
      }
    });
}

mp.events.add({
  render: textBubbleRenderHandler
});
