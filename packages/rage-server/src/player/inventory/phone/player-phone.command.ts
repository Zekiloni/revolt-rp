import { registerCommand } from '../../player-command.service';
import { getPlayerActivePhoneCall, playerAnswerPhoneCall, playerHangupPhoneCall } from './player-phone.service';


registerCommand({
  name: 'hangup',
  description: 'todo',
  async handle(player: PlayerMp) {

    const activePhoneCall = await getPlayerActivePhoneCall(player);

    if (!activePhoneCall)
      return;

    await playerHangupPhoneCall(player, activePhoneCall.id);
  }
})


registerCommand({
  name: 'pickup',
  description: 'todo',
  async handle(player: PlayerMp) {

    const activePhoneCall = await getPlayerActivePhoneCall(player);

    if (!activePhoneCall)
      return;

    await playerAnswerPhoneCall(player, activePhoneCall.id);
  }
})



