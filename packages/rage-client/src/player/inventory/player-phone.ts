import { on, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { AnimationFlag, HexKeyCodes, PlayerPhoneState, PlayerSharedDataType, ProcedureKey } from '@revolt-rp/common';
import { clearPlayerAnimations, playAnimation } from '../util/player-animation.util';
import { registerKeyBind, unregisterKeyBind } from '../../core/keybind-manager';
import { getIsAlive, getIsNotCuffed } from '../util/player-data.util';
import { browser } from '../../core/browser';


let isCurrentLocationActive = false;
let phoneMapUpdateInterval: NodeJS.Timeout | null = null;
let phoneProp = false;


function takeOutPhoneHandler() {
  triggerServer(ProcedureKey.SERVER_TOGGLE_PHONE, true);
}

function putAwayPhoneHandler() {
  triggerServer(ProcedureKey.SERVER_TOGGLE_PHONE, false);
}

async function syncPlayerPhoneState(player: PlayerMp, state: PlayerPhoneState, oldState?: PlayerPhoneState) {
  let animationLib: string | null = 'cellphone@';
  let animationName: string | null = null;

  if (player.vehicle) {
    animationLib = 'anim@cellphone@in_car@ps';
  }

  switch (state) {
    case PlayerPhoneState.Idle:
      animationName = 'cellphone_text_in';
      break;
    case PlayerPhoneState.Away:
      animationName = null;
      animationLib = null;

      if (oldState === PlayerPhoneState.Ringing || oldState === PlayerPhoneState.InCall) {
        mp.game.audio.playSoundFromEntity(mp.game.audio.getSoundId(), 'Hang_Up', player.handle, 'Phone_SoundSet_Michael', true, 0);
      }
      break;
    case PlayerPhoneState.Ringing:
      animationName = 'cellphone_text_in';
      mp.game.audio.playSoundFromEntity(mp.game.audio.getSoundId(), 'Text_Arrive_Tone', player.handle, 'Phone_Soundset_Franklin', true, 0);
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

  await syncPlayerPhoneState(player, value, oldValue);

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

async function playerStreamInPhoneStateHandler(player: PlayerMp) {
  if (player.type != RageEnums.EntityType.PLAYER)
    return;

  const playerPhoneState = player.getVariable<PlayerPhoneState | null>(PlayerSharedDataType.PhoneState);
  await syncPlayerPhoneState(player, playerPhoneState);
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

function takePhoneCameraPhotoHandler() {
  mp.game.audio.playSoundFrontend(-1, 'Camera_Shoot', 'Phone_Soundset_Franklin', true);
  mp.gui.takeScreenshot(`phone-${Date.now()}.png`, 1, 100, 0);
}


mp.events.addDataHandler(PlayerSharedDataType.PhoneState, handlePlayerPhoneStateChange);
mp.events.add({
  entityStreamIn: playerStreamInPhoneStateHandler
});

on(ProcedureKey.CLIENT_PHONE_MAP_INIT, phoneMapInitializeHandler);
on(ProcedureKey.CLIENT_PHONE_CAMERA_TOGGLE, togglePhoneCameraHandler);
on(ProcedureKey.CLIENT_PHONE_CAMERA_TAKE_PHOTO, takePhoneCameraPhotoHandler);
