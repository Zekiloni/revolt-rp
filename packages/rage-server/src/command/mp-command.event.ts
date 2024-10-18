// import { getSlashCommand, registerSlashCommand } from './command.service';
//
// function handlePlayerCommand(player: PlayerMp, fullCommand: string) {
//   const args = fullCommand.split(/ +/);
//   const commandKey = args.splice(0, 1)[0];
//
//   const command = getSlashCommand(commandKey);
//
//   if (!command)
//     return; // MSG command not found
//
//   if (command.administrator) {
//     // if player.administrator < command.administrator
//     return;
//   }
//
//   if (command.validators && command.validators.length != 0) {
//     for (const commandValidator of command.validators) {
//       const result = commandValidator.validator(player);
//       if (!result) {
//         // throw commandValidator.message
//         return;
//       }
//     }
//   }
// }
//
// mp.events.add({
//   playerCommand: handlePlayerCommand
// });
//
//
// const isPlayerInVehicleValidator = {
//   validator: (player: PlayerMp) => {
//     return !!player.vehicle;
//   },
//   message: 'You are not in vehicle'
// };
//
// registerSlashCommand({
//     name: 'me',
//     description: 'Throw an emote',
//     validators: [
//       isPlayerInVehicleValidator
//     ],
//     execute(player: PlayerMp, ...args) {
//     }
//   }
// );
