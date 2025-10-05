import { ProcedureKey } from '@revolt-rp/common';
import { on } from '@libertymp/rage-rpc';

let isSpectating = false;
let spectateCamera: CameraMp | null = null;
let spectateTarget: PlayerMp | null = null;
let originalPosition: Vector3 | null = null;
let originalDimension = 0;


const SPECTATE_FOV = 60;
const SPECTATE_OFFSET = new mp.Vector3(0, -3, 1); // Behind and slightly above

function toggleSpectate(targetId: number | null) {
  if (targetId === null) {
    if (isSpectating) {
      stopSpectating();
    }
    return;
  } else {
    const target = mp.players.atRemoteId(targetId);
    if (!target || !mp.players.exists(target)) {
      return;
    }

    startSpectating(target);
  }
}

function startSpectating(target: PlayerMp) {
  try {
    // Save current state if not already spectating
    if (!isSpectating) {
      originalPosition = mp.players.local.position;
      originalDimension = mp.players.local.dimension;

      // Make local player invisible and invincible
      mp.players.local.setAlpha(0);
      mp.players.local.setInvincible(true);
      mp.players.local.setCollision(false, false);
      mp.game.ui.displayRadar(false);
    }

    spectateTarget = target;

    // Ensure target is in stream
    if (target.handle === 0) {
      target.forceStreamingUpdate();
    }

    // Create or reuse camera
    if (!spectateCamera) {
      spectateCamera = mp.cameras.new('default', target.position, new mp.Vector3(0, 0, 0), SPECTATE_FOV);
    }

    spectateCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

    isSpectating = true;
  } catch (err) {
    console.error('Error starting spectate:', err);
    stopSpectating();
  }
}

function stopSpectating() {
  try {
    // Destroy camera
    if (spectateCamera) {
      spectateCamera.setActive(false);
      spectateCamera.destroy();
      spectateCamera = null;
    }

    mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);

    // Restore player state
    mp.players.local.setAlpha(255);
    mp.players.local.setInvincible(false);
    mp.players.local.setCollision(true, true);

    mp.game.ui.displayRadar(true);

    // Restore position if saved
    if (originalPosition) {
      mp.players.local.setCoordsNoOffset(
        originalPosition.x,
        originalPosition.y,
        originalPosition.z,
        false,
        false,
        false
      );
      mp.players.local.dimension = originalDimension;
      originalPosition = null;
    }

    spectateTarget = null;
    isSpectating = false;
  } catch (err) {
    console.error('Error stopping spectate:', err);
  }
}

mp.events.add('render', () => {
  if (!isSpectating || !spectateTarget || !spectateCamera) {
    return;
  }

  try {
    // Check if target still exists
    if (!mp.players.exists(spectateTarget) || spectateTarget.handle === 0) {
      stopSpectating();
      return;
    }

    // Update camera to follow target
    const targetPos = spectateTarget.position;
    const targetRot = spectateTarget.getRotation(2);

    // Calculate camera position behind target
    const radians = (targetRot.z * Math.PI) / 180;
    const camPos = new mp.Vector3(
      targetPos.x - Math.sin(radians) * SPECTATE_OFFSET.y,
      targetPos.y - Math.cos(radians) * SPECTATE_OFFSET.y,
      targetPos.z + SPECTATE_OFFSET.z
    );

    spectateCamera.setCoord(camPos.x, camPos.y, camPos.z);
    spectateCamera.pointAtCoord(targetPos.x, targetPos.y, targetPos.z + 0.5);

    mp.players.local.setCoordsNoOffset(
      targetPos.x,
      targetPos.y,
      targetPos.z - 10, // Underground to stay hidden
      false,
      false,
      false
    );
  } catch (err) {
    stopSpectating();
  }
});

on(ProcedureKey.CLIENT_TOGGLE_SPECTATE, toggleSpectate);
