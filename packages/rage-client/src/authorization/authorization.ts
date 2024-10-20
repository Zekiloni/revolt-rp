import { on } from '@libertymp/rage-rpc';
import { GameUiKey, ProcedureKey } from '@bcrp-rage/common';
import { hideInterface, showInterface } from '../core/browser';
import { authConfig } from './auth.config';

let authCamera: CameraMp | null = null;

mp.console.logInfo('auth loaded');

async function toggleAuthorization(toggle: boolean) {
  mp.gui.chat.push(`togglePlayerAuthorization is  ${toggle}`);
  mp.console.logInfo('togglePlayerAuthorization is' + toggle);

  if (toggle) {
    showInterface(GameUiKey.Authorization);
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
    hideInterface(GameUiKey.Authorization);
    mp.players.local.setAlpha(255);

    if (authCamera && mp.cameras.exists(authCamera.handle)) {
      authCamera.destroy();
      await mp.game.waitAsync(0);
      authCamera = null;
    }
  }
}

on(ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, toggleAuthorization);
