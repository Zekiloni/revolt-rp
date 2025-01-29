import { disabledControls } from '../../core/disabled-control';

export function disablePlayerControl(inputControls: RageEnums.Controls[]) {
   for (const inputControl of inputControls) {
      disabledControls.add(inputControl);
   }
}

export function enablePlayerControl(inputControls: RageEnums.Controls[]) {
   for (const inputControl of inputControls) {
      disabledControls.delete(inputControl);
   }
}


export function enableAllPlayerControls() {
   mp.players.local.freezePosition(false);
   mp.players.local.setInvincible(false);
   mp.game.controls.enableAllControlActions(RageEnums.InputGroup.INPUTGROUP_WHEEL);
}

export function disableAllPlayerControl() {
   mp.players.local.freezePosition(true);
   mp.players.local.setInvincible(true);
   mp.game.controls.disableAllControlActions(RageEnums.InputGroup.INPUTGROUP_WHEEL);
}
