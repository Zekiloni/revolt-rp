import { PlayerSharedDataType } from '@revolt-rp/common';
import { disablePlayerControl, enablePlayerControl } from '../player/util/player-control.util';


function playerSeatbeltDataHandler(player: PlayerMp, value: boolean, oldValue?: boolean) {
  if (player.type != RageEnums.EntityType.PLAYER)
    return;

  // TODO: Audio effect?
  //mp.game.audio.playSoundFromEntity(mp.game.audio.getSoundId(), 'Text_Arrive_Tone', player.handle, 'Phone_Soundset_Franklin', true, 0);

  player.setConfigFlag(RageEnums.Player.ConfigFlag.CAN_FLY_THRU_WINDSCREEN, !value);

  if (player.handle === mp.players.local.handle) {
    if (value) {
      disablePlayerControl([RageEnums.Controls.INPUT_VEH_DUCK]);
    } else {
      enablePlayerControl([RageEnums.Controls.INPUT_VEH_DUCK]);
    }
  }
}

function playerStreamInSeatbeltHandler(player: PlayerMp) {
  if (player.type != RageEnums.EntityType.PLAYER)
    return;

  const seatbelt = player.getVariable(PlayerSharedDataType.Seatbelt);

  if (seatbelt && player.vehicle) {
    if (player.getConfigFlag(RageEnums.Player.ConfigFlag.CAN_FLY_THRU_WINDSCREEN, true)) {
      player.setConfigFlag(RageEnums.Player.ConfigFlag.CAN_FLY_THRU_WINDSCREEN, false);
    }
  }
}


mp.events.addDataHandler(PlayerSharedDataType.Seatbelt, playerSeatbeltDataHandler);
mp.events.add({
  entityStreamIn: playerStreamInSeatbeltHandler
});
