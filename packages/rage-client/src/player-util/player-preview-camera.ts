import { AnimationFlags, isPlayingAnimation, playAnimation, stopAnimation } from '../player-animation/animation';


const [minFov, maxFov] = [10, 100];
let currentFov = 0;

let [cursorPreviousX, cursorPreviousY] = mp.gui.cursor.position;
let zPos = 0;
let movableCamera: CameraMp;
let handleControlsInterval: ReturnType<typeof setInterval>;
let headingPosition = 0;
let timeBetweenAnimChecks = Date.now() + 100;


let isActive: boolean = false;
let basePosition: Vector3 | undefined;

async function handlePreviewCameraControls() {
   if (!isActive)
      return;

   if (Date.now() > timeBetweenAnimChecks) {
      timeBetweenAnimChecks = Date.now() + 1500;
      const isPlaying = isPlayingAnimation(mp.players.local, 'nm@hands', 'hands_up');
      if (!isPlaying) {
         await playAnimation(mp.players.local, 'nm@hands', 'hands_up', AnimationFlags.STOP_LAST_FRAME, -1);
      }
   }

   if (movableCamera && mp.cameras.exists(movableCamera)) {
      const x = cursorPreviousX, y = cursorPreviousY;

      cursorPreviousX = mp.gui.cursor.position[0];
      cursorPreviousY = mp.gui.cursor.position[1];

      const [deltaX, deltaY] = [mp.gui.cursor.position[0] - x, mp.gui.cursor.position[1] - y];

      if (!mp.keys.isDown(0x02))
         return;

      // scroll up / zoom in
      if (mp.game.controls.isDisabledControlPressed(RageEnums.InputGroup.INPUTGROUP_MOVE, RageEnums.Controls.INPUT_WEAPON_WHEEL_PREV)) {
         currentFov -= 2;

         if (currentFov < minFov) {
            currentFov = minFov;
         }
      }

      // scroll down / zoom out
      if (mp.game.controls.isDisabledControlPressed(RageEnums.InputGroup.INPUTGROUP_MOVE, RageEnums.Controls.INPUT_WEAPON_WHEEL_NEXT)) {
         currentFov += 2;

         if (currentFov > maxFov) {
            currentFov = maxFov;
         }
      }

      movableCamera.setFov(currentFov);

      const { x: positionX, y: positionY, z: positionZ } = mp.players.local.getCoords(true);
      let { z: camPosZ } = movableCamera.getCoord();

      headingPosition += deltaX * 0.15;

      const { x: offsetX, y: offsetY } = new mp.Vector3(
         positionX + Math.cos(((headingPosition + 90) * Math.PI) / 180) * 1.4,
         positionY + Math.sin(((headingPosition + 90) * Math.PI) / 180) * 1.4,
         positionZ,
      );

      camPosZ = camPosZ + deltaY * 0.001;

      if (camPosZ < positionZ + 0.7 && camPosZ > positionZ - 0.8) {
         movableCamera.setCoord(offsetX, offsetY, camPosZ);
         movableCamera.pointAtCoord(positionX, positionY, camPosZ);
      }
   }
}

export function togglePlayerPreviewCamera(toggle: boolean) {
   isActive = toggle;

   if (toggle) {
      basePosition = mp.players.local.getCoords(true);

      const { x, y, z } = basePosition;
      const { x: forwardX, y: forwardY } = mp.players.local.getForwardVector();

      currentFov = 65;

      const cameraPosition = new mp.Vector3(
         x + forwardX * 1.4,
         y + forwardY * 1.4,
         z + zPos,
      );

      headingPosition = mp.players.local.getHeading();

      movableCamera = mp.cameras.new('default', cameraPosition, new mp.Vector3(0, 0, 0), currentFov);
      movableCamera.setCoord(cameraPosition.x, cameraPosition.y, cameraPosition.z);
      movableCamera.pointAtCoord(x, y, z);
      movableCamera.setActive(true);
      mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

      handleControlsInterval = setInterval(handlePreviewCameraControls, 0);
   } else {
      if (movableCamera && mp.cameras.exists(movableCamera)) {
         movableCamera.destroy();
         mp.game.cam.renderScriptCams(false, false, 0, false, false, 0);
      }
      stopAnimation(mp.players.local, 'nm@hands', 'hands_up');
      clearInterval(handleControlsInterval);
   }
}


