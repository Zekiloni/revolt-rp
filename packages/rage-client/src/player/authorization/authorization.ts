import { on, triggerBrowser } from '@libertymp/rage-rpc';
import { GameUiKey, ProcedureKey, StorageDataKey } from '@revolt-rp/common';
import { browser, hideGameInterface, showGameInterface } from '../../core/browser';
import { getStorage, saveStorage } from '../../core/storage-manager';
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

    const savedUsername = getStorage<string | undefined>(StorageDataKey.Username);
    if (savedUsername) {
      triggerBrowser(browser, ProcedureKey.BROWSER_AUTHORIZATION_REMEMBER, savedUsername);
    }
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

function saveAuthorizationUsername(username: string) {
  saveStorage(StorageDataKey.Username, username);
}

function discordOAuth2() {
  mp.discord.requestOAuth2(authConfig.discordAppId)
    .then((response: string) => {
      //triggerBrowser(browser, ProcedureKey.BROWSER_AUTHORIZATION_DISCORD, response);
    });
}

on(ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, toggleAuthorization);
on(ProcedureKey.CLIENT_AUTHORIZATION_REMEMBER_ME, saveAuthorizationUsername);
