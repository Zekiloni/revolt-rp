import { defaultHiddenHudComponents } from './player-hud.config';

const hiddenHudComponents: Set<RageEnums.HudComponent> = new Set<RageEnums.HudComponent>(
  [
    ...defaultHiddenHudComponents
  ]
);

function handleHiddenPlayerHudComponents() {
  for (const hudComponent of hiddenHudComponents) {
    mp.game.ui.hideHudComponentThisFrame(hudComponent);
  }
}

export const hidePlayerHudComponent = (hudComponent: RageEnums.HudComponent) => {
  if (hiddenHudComponents.has(hudComponent))
    return;

  hiddenHudComponents.add(hudComponent);
};

export const showPlayerHudComponent = (hudComponent: RageEnums.HudComponent) => {
  hiddenHudComponents.delete(hudComponent);
};


mp.events.add({
  render: handleHiddenPlayerHudComponents
});
