import { registerKeyBind } from '../core/keybind-manager';
import { HexKeyCodes } from '@revolt-rp/common';

const configuration = {
  maxSpeed: 10.0,
  minHeight: 15.0,
  maxHeight: 45.0,
  maxAngle: 15.0
}

const TASK_RAPPEL_FROM_HELI  = -275944640;

function rappel() {
  const vehicle = mp.players.local.vehicle;
  if (!vehicle) {
    return;
  }

  if (!vehicle.doesAllowRappel()) {
    return;
  }

  if (vehicle.getSpeed() > configuration.maxSpeed) {
    mp.gui.chat.push("The vehicle is too fast for rappelling.");
    return;
  }

  if (vehicle.getPedInSeat(-1) === mp.players.local.handle || vehicle.getPedInSeat(0) === mp.players.local.handle) {
    mp.gui.chat.push("You cannot rappel from your seat.");
    return;
  }

  const taskStatus = mp.players.local.getScriptTaskStatus(TASK_RAPPEL_FROM_HELI);
  if (taskStatus === 0 || taskStatus === 1) {
    return;
  }

  const curHeight = vehicle.getHeightAboveGround();
  if (curHeight < configuration.minHeight || curHeight > configuration.maxHeight) {
    return;
  }

  if (!vehicle.isUpright(configuration.maxAngle) || vehicle.isUpsidedown()) {
    return;
  }

  mp.players.local.clearTasks();
  mp.players.local.taskRappelFromHeli(10.0);
}

registerKeyBind(HexKeyCodes.H, false, rappel, 3000);
