import { on } from '@libertymp/rage-rpc';
import { CharacterGender, GameUiKey, ProcedureKey } from '@bcrp-rage/common';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { toggleAuthorization } from './authorization';
import { characterCreatorConfig } from './character-creator.config';
import { togglePlayerPreviewCamera } from '../player-util/player-preview-camera';

async function toggleCharacterCreator(toggle: boolean) {
  if (toggle) {
    mp.gui.chat.show(false);
    await toggleAuthorization(false);
    showGameInterface(GameUiKey.CharacterCreator);
    mp.players.local.position = characterCreatorConfig.position;
    mp.players.local.setHeading(characterCreatorConfig.heading);
    mp.players.local.freezePosition(true);
  } else {
    hideGameInterface(GameUiKey.CharacterCreator);
    mp.players.local.freezePosition(false);
    mp.players.local.clearTasksImmediately();
  }

  togglePlayerPreviewCamera(toggle);
}

function handlePedModelChange(gender: CharacterGender) {
  mp.players.local.model = (gender == CharacterGender.FEMALE ? RageEnums.Ped.Hash.MP_F_FREEMODE_01 : RageEnums.Ped.Hash.MP_M_FREEMODE_01);
}

on(ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, toggleCharacterCreator);
on(ProcedureKey.CLIENT_CREATOR_CHANGE_PED_MODEL, handlePedModelChange);
