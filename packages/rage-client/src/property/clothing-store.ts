import { on, register, triggerBrowser } from '@libertymp/rage-rpc';
import { GameUiKey, IProperty, ProcedureKey } from '@revolt-rp/common';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';
import { togglePlayerPreviewCamera } from '../player/util/player-preview-camera';
import { getClothingComponentName } from '../util/clothing.util';

const fallbackClothingComponent: { [key: number]: [number, number, number] } = {};


function toggleClothingStore(property: IProperty | null) {
  if (property) {
    showGameInterface(GameUiKey.ClothingStore);
    togglePlayerPreviewCamera(true);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_PROPERTY, property), 150);
  } else {
    hideGameInterface(GameUiKey.ClothingStore);
    togglePlayerPreviewCamera(false);
    reverseClothingComponents();
  }
}


function reverseClothingComponents() {
  for (const key in fallbackClothingComponent) {
    const componentId = Number(key);

    if (fallbackClothingComponent[componentId]) {
      const [drawableId, textureId, paletteId] = fallbackClothingComponent[componentId];
      mp.players.local.setComponentVariation(componentId, drawableId, textureId, paletteId);
      delete fallbackClothingComponent[componentId];
    }
  }
}

function previewClothingComponent(data: [number, number, number]) {
  const [componentId, drawableId, textureId] = data;

  if (!fallbackClothingComponent[componentId]) {
    fallbackClothingComponent[componentId] = [
      mp.players.local.getDrawableVariation(componentId),
      mp.players.local.getTextureVariation(componentId),
      mp.players.local.getPaletteVariation(componentId)
    ];
  }

  if (mp.players.local.isComponentVariationValid(componentId, drawableId, textureId)) {
    mp.console.logInfo(`Previewing clothing component: ${getClothingComponentName(componentId, drawableId, textureId)}`);
    mp.players.local.setComponentVariation(componentId, drawableId, textureId, 0);
  }
}

function getPlayerModelHandler() {
  return mp.players.local.model === RageEnums.Hashes.Ped.MP_M_FREEMODE_01 ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
}


function getComponentDrawableVariationsHandler(componentId: number) {
  return Array.from({ length: mp.players.local.getNumberOfDrawableVariations(componentId) }, (_, i) => i);
}

function getComponentTextureVariationsHandler(data: [number, number]) {
  const [componentId, drawableId] = data;
  return Array.from({ length: mp.players.local.getNumberOfTextureVariations(componentId, drawableId) }, (_, i) => i);
}

on(ProcedureKey.CLIENT_TOGGLE_CLOTHING_STORE, toggleClothingStore);
on(ProcedureKey.CLIENT_CLOTHING_PREVIEW, previewClothingComponent);
register(ProcedureKey.CLIENT_GET_PLAYER_MODEL, getPlayerModelHandler);
register(ProcedureKey.CLIENT_GET_DRAWABLE_VARIATIONS, getComponentDrawableVariationsHandler);
register(ProcedureKey.CLIENT_GET_TEXTURE_VARIATIONS, getComponentTextureVariationsHandler);
