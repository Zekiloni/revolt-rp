import { on } from '@libertymp/rage-rpc';
import { GameUiKey, ProcedureKey } from '@bcrp-rage/common';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { toggleAuthorization } from './authorization';
import { characterCreatorConfig } from './character-creator.config';
import { togglePlayerPreviewCamera } from '../player-util/player-preview-camera';

async function toggleCharacterCreator(toggle: boolean) {
  if (toggle) {
    await toggleAuthorization(false);
    showGameInterface(GameUiKey.CharacterCreator);
    mp.players.local.position = characterCreatorConfig.position;
    mp.players.local.setHeading(characterCreatorConfig.heading);
    mp.players.local.freezePosition(true);
  } else {
    hideGameInterface(GameUiKey.CharacterCreator);
  }

  togglePlayerPreviewCamera(toggle);
}



on(ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, toggleCharacterCreator);

