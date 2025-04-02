import { on } from '@libertymp/rage-rpc';
import { GameUiKey, IProperty, ProcedureKey } from '@revolt-rp/common';
import { hideGameInterface, showGameInterface } from '../core/browser';
import { togglePlayerPreviewCamera } from '../player/util/player-preview-camera';


function toggleClothingStore(property: IProperty | null) {
  if (property) {
    showGameInterface(GameUiKey.ClothingStore);
    togglePlayerPreviewCamera(true);
  } else {
    hideGameInterface(GameUiKey.ClothingStore);
    togglePlayerPreviewCamera(false);
  }
}

function previewClothingComponent(component: [number, number, number]) {
  mp.players.local.setComponentVariation(component[0], component[1], component[2], 0);
}

on(ProcedureKey.CLIENT_TOGGLE_CLOTHING_STORE, toggleClothingStore);
on(ProcedureKey.CLIENT_CLOTHING_PREVIEW, previewClothingComponent);
