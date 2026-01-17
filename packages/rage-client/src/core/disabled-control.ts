
export const attackAction = [
  RageEnums.Controls.INPUT_ATTACK,
  RageEnums.Controls.INPUT_ATTACK2,
  RageEnums.Controls.INPUT_AIM,
];

export const sprintAndJumpAction = [
  RageEnums.Controls.INPUT_JUMP,
  RageEnums.Controls.INPUT_SPRINT
];

export const movementAction = [
  RageEnums.Controls.INPUT_MOVE_LR,
  RageEnums.Controls.INPUT_MOVE_UD,
  RageEnums.Controls.INPUT_MOVE_UP_ONLY,
  RageEnums.Controls.INPUT_MOVE_DOWN_ONLY,
];


export const disabledControls: Set<RageEnums.Controls> = new Set();


function handleDisabledPlayerControls() {
  for (const inputControl of disabledControls) {
    mp.game.controls.disableControlAction(RageEnums.InputGroup.MAX_INPUTGROUPS, inputControl, true);
  }
}


mp.events.add({ render: handleDisabledPlayerControls });
