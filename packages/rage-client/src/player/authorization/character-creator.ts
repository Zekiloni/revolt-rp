import { on } from '@libertymp/rage-rpc';
import {
  CharacterGender, defaultOutfits,
  faceFeatureNames,
  GameUiKey,
  HeadBlendData,
  HeadOverlayComponent,
  ProcedureKey
} from '@revolt-rp/common';
import { hideGameInterface, showGameInterface } from '../../core/browser';
import { toggleAuthorization } from './authorization';
import { characterCreatorConfig } from './character-creator.config';
import { togglePlayerPreviewCamera } from '../util/player-preview-camera';
import { applyBestTorso } from '../util/player-clothing.util';

async function toggleCharacterCreator(toggle: boolean) {
  if (toggle) {
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

function handleHeadBlendDataChange(headBlendData: HeadBlendData) {
  mp.players.local.setHeadBlendData(
    headBlendData.shapeFirstId,
    headBlendData.shapeSecondId,
    0,
    headBlendData.skinFirstId,
    headBlendData.skinSecondId,
    0,
    headBlendData.shapeMix,
    headBlendData.skinMix,
    0,
    false
  );
}

function handleFaceFeatureChange(value: number[]) {
  faceFeatureNames.forEach((_name, i) => {
    mp.players.local.setFaceFeature(i, value[i]);
  });
}

function handleEyeColorChange(value: number) {
  mp.players.local.setEyeColor(value);
}

function handleBeardChange(value: [number, number, number]) {
  const [style, color, opacity] = value;
  mp.players.local.setHeadOverlay(RageEnums.HeadOverlays.FacialHair, style, opacity, color, color);
}

function handleHeadOverlayChange(component: [number, HeadOverlayComponent]) {
  const [overlayId, data] = component;
  mp.players.local.setHeadOverlay(overlayId, data.value == null ? 255 : data.value, data.opacity, data.color, data.color);
}

function handleHairChange(value: [number, number, number]) {
  const [style, color, highlightColor] = value;
  mp.players.local.setComponentVariation(RageEnums.Clothes.HAIR_STYLE, style, 0, 2);
  mp.players.local.setHairColor(color, highlightColor);
}

function handleOutfitChange([gebder, selectedOutfit]: [CharacterGender, number]) {
  const components = defaultOutfits[gebder][selectedOutfit];

  if (components) {
    components.forEach((component) => {
      mp.players.local.setComponentVariation(component.componentId, component.drawable, component.texture, component.palette);
    });

    applyBestTorso();
  }
}

on(ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, toggleCharacterCreator);
on(ProcedureKey.CLIENT_CREATOR_CHANGE_PED_MODEL, handlePedModelChange);
on(ProcedureKey.CLIENT_CREATOR_UPDATE_HEAD_BLEND_DATA, handleHeadBlendDataChange);
on(ProcedureKey.CLIENT_CREATOR_UPDATE_FACE_FEATURE, handleFaceFeatureChange);
on(ProcedureKey.CLIENT_CREATOR_CHANGE_EYE_COLOR, handleEyeColorChange);
on(ProcedureKey.CLIENT_CREATOR_UPDATE_BEARD, handleBeardChange);
on(ProcedureKey.CLIENT_CREATOR_UPDATE_HEAD_OVERLAY, handleHeadOverlayChange);
on(ProcedureKey.CLIENT_CREATOR_UPDATE_HAIR, handleHairChange);
on(ProcedureKey.CLIENT_CREATOR_CHANGE_OUTFIT, handleOutfitChange);
