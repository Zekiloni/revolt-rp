import { authConfig } from './auth.config';
import { on } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@bc-rp-rage/shared';

let authCamera: CameraMp | null = null;

on(ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, togglePlayerAuthorization);

async function togglePlayerAuthorization(toggle: boolean) {
   mp.gui.chat.push(`togglePlayerAuthorization is  ${toggle}`)
   if (toggle) {
      showPlayerGameInterface('playerAuthorization');

      mp.players.local.position = authConfig.cameraCoords;
      mp.players.local.setAlpha(0);
      mp.players.local.freezePosition(true);

      mp.game.ui.displayRadar(false);

      authCamera = mp.cameras.new('default', authConfig.cameraCoords, new mp.Vector3(0, 0, 0), 40);
      authCamera.pointAtCoord(
         authConfig.cameraLookAtCoords.x,
         authConfig.cameraLookAtCoords.y,
         authConfig.cameraLookAtCoords.z,
      );
      authCamera.setActive(true);
      mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
   } else {
      hidePlayerGameInterface('playerAuthorization');

      mp.players.local.setAlpha(255);
      if (authCamera && mp.cameras.exists(authCamera.handle)) {
         authCamera.destroy();
         await mp.game.waitAsync(0);
         authCamera = null;
      }
   }
}
