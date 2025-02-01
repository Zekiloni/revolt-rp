import { getTextBubble } from '../util/player-data.util';
import { getDistance } from '../../util/vector.util';

const TEXT_BUBBLE_RENDER_DISTANCE = 15.0;

function textBubbleRenderHandler() {
  const { position } = mp.players.local;

  mp.players.forEachInRange(mp.players.local.position, TEXT_BUBBLE_RENDER_DISTANCE,
    (target) => {
      const { position: targetPosition } = target;

      const distance = getDistance(position, targetPosition);
      const textBubble = getTextBubble(target);

      if (textBubble && textBubble.content && textBubble.content.length) {
        if (distance < textBubble.distance && mp.players.local.id != target.id) {
          if (mp.players.local.hasClearLosTo(target.handle, 17)) {
            if (target.getAlpha() != 0) {
              const boneIndex = target.getBoneIndex(RageEnums.Ped.Bones.IK_HEAD);
              const bonePosition = target.getWorldPositionOfBone(boneIndex);

              const screenPos = mp.game.graphics.world3dToScreen2d(bonePosition);

              if (screenPos) {
                // eslint-disable-next-line prefer-const
                let { x, y } = screenPos;

                mp.game.graphics.drawText(textBubble.content, [x, y - 0.1525], {
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
