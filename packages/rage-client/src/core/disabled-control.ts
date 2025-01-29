export const disabledControls: Set<RageEnums.Controls> = new Set();


function handleDisabledPlayerControls() {
  for (const inputControl of disabledControls) {
    mp.game.controls.disableControlAction(RageEnums.InputGroup.MAX_INPUTGROUPS, inputControl, true);
  }
}


mp.events.add({ render: handleDisabledPlayerControls });
