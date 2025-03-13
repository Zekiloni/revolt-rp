import { registerCommand } from '../../player-command.service';
import { getActivePhoneCallByPhoneNumber, getPlayerPhoneNumbers, playerSpeakPhoneCall } from './player-phone.service';


registerCommand({
  name: 'ph',
  description: 'todo',
  params: ['content'],
  async handle(player: PlayerMp, ...args) {
    const phoneNumbers = getPlayerPhoneNumbers(player);

    if (!phoneNumbers.length)
      return;

    const activeCall = await getActivePhoneCallByPhoneNumber(phoneNumbers);

    if (!activeCall)
      return;

    await playerSpeakPhoneCall(player, phoneNumbers, activeCall, args.join(' '));
  }
})
