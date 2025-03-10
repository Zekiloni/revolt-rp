import { on, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import {
  AnimationFlag,
  HexKeyCodes,
  PlayerPhoneState,
  PlayerSharedDataType,
  ProcedureKey
} from '@revolt-rp/common';
import { browser } from '../../core/browser';
import { getIsAlive, getIsNotCuffed } from '../util/player-data.util';
import { registerKeyBind, unregisterKeyBind } from '../../core/keybind-manager';
import { clearPlayerAnimations, playAnimation } from '../util/player-animation.util';


let isCurrentLocationActive = false;
let phoneMapUpdateInterval: NodeJS.Timeout | null = null;
let phoneProp = false;


function takeOutPhoneHandler() {
  triggerServer(ProcedureKey.SERVER_TOGGLE_PHONE, true);
}

function putAwayPhoneHandler() {
  triggerServer(ProcedureKey.SERVER_TOGGLE_PHONE, false);
}


function togglePhoneCamera(toggle: boolean, frontCamera?: boolean) {
  if (toggle) {
    if (!phoneProp) {
      phoneProp = true;
      mp.game.mobile.createMobilePhone(0);
      mp.game.mobile.setMobilePhoneScale(0);
    }

    mp.game.mobile.cellCamActivate(true, true);
    mp.game.invoke(RageEnums.Natives.MOBILE._CELL_CAM_DISABLE_THIS_FRAME, frontCamera);
  } else {
    phoneProp = false;
    mp.game.mobile.destroyPhone();
    mp.game.mobile.cellCamActivate(false, false);
  }
}

async function handlePlayerPhoneStateChange(player: PlayerMp, value: PlayerPhoneState | null, oldValue?: PlayerPhoneState | null) {
  if (player.type != RageEnums.EntityType.PLAYER)
    return;

  // TODO: Implement phone state change handling

  let animationLib: string | null = 'cellphone@';
  let animationName: string | null = null;

  if (player.vehicle) {
    animationLib = 'anim@cellphone@in_car@ps';
  }

  switch (value) {
    case PlayerPhoneState.Idle:
      animationName = 'cellphone_text_in';
      break;
    case PlayerPhoneState.Away:
      animationName = null;
      animationLib = null;
      break;
    case PlayerPhoneState.InCall:
      animationName = 'cellphone_call_listen_base';
      break;
  }

  if (animationLib && animationName) {
    await playAnimation(player, animationLib, animationName, AnimationFlag.UPPER_BODY_STOP_ON_LAST_FRAME_CONTROLLABLE);
  } else {
    clearPlayerAnimations(player);
  }

  if (player.handle === mp.players.local.handle) {
    if (value == null && oldValue != undefined) {
      unregisterKeyBind(HexKeyCodes.Up, takeOutPhoneHandler);
      unregisterKeyBind(HexKeyCodes.Down, putAwayPhoneHandler);
    } else {
      registerKeyBind(HexKeyCodes.Up, true, takeOutPhoneHandler, 0, [getIsNotCuffed, getIsAlive]);
      registerKeyBind(HexKeyCodes.Down, true, putAwayPhoneHandler, 0, [getIsNotCuffed, getIsAlive]);
    }
  }
}

function phoneMapInitializeHandler(toggle: boolean) {
  isCurrentLocationActive = toggle;

  if (isCurrentLocationActive) {
    phoneMapUpdateInterval = setInterval(() => {
      triggerBrowser(browser, ProcedureKey.BROWSER_SET_CURRENT_LOCATION, {
        lat: mp.players.local.position.y,
        lng: mp.players.local.position.x
      });
    }, 250);
  } else {
    if (phoneMapUpdateInterval) {
      clearInterval(phoneMapUpdateInterval);
      phoneMapUpdateInterval = null;
    }
  }
}


function togglePhoneCameraHandler(state: PlayerPhoneState) {
  switch (state) {
    case PlayerPhoneState.FrontCamera:
      togglePhoneCamera(true, true);
      break;

    case PlayerPhoneState.BackCamera:
      togglePhoneCamera(true, false);
      break;

    default:
      togglePhoneCamera(false, false);
  }
}

mp.events.addDataHandler(PlayerSharedDataType.PhoneState, handlePlayerPhoneStateChange);
on(ProcedureKey.CLIENT_PHONE_MAP_INIT, phoneMapInitializeHandler);
on(ProcedureKey.CLIENT_PHONE_CAMERA_TOGGLE, togglePhoneCameraHandler);
