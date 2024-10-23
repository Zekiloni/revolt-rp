import { on } from '@libertymp/rage-rpc';
import { GameUiKey, ProcedureKey } from '@bcrp-rage/common';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { authConfig } from './auth.config';

let authCamera: CameraMp | null = null;

export async function toggleAuthorization(toggle: boolean) {
  if (toggle) {
    showGameInterface(GameUiKey.Authorization);
    mp.players.local.position = authConfig.cameraCoords;

    mp.game.ui.displayRadar(false);
    mp.players.local.setAlpha(0);
    authCamera = mp.cameras.new('default', authConfig.cameraCoords, new mp.Vector3(0, 0, 0), 40);
    authCamera.pointAtCoord(
      authConfig.cameraLookAtCoords.x,
      authConfig.cameraLookAtCoords.y,
      authConfig.cameraLookAtCoords.z
    );
    authCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
  } else {
    hideGameInterface(GameUiKey.Authorization);
    mp.players.local.setAlpha(255);
    mp.players.local.freezePosition(false);

    if (authCamera && mp.cameras.exists(authCamera)) {
      authCamera.destroy();
      mp.game.cam.renderScriptCams(false, false, 0, false, false, 0);
    }
  }
}

on(ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, toggleAuthorization);
