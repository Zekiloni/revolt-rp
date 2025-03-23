import { appendFile } from 'fs';
import { logger } from '../core/logger.config';

const saveFile = 'saved_positions.json';

const savePosLogger = logger('SavePos');

export function savePlayerPosition(player: PlayerMp, name = 'Unknown'): void {
  const pos = (player.vehicle) ? player.vehicle.position : player.position;
  const rot = (player.vehicle) ? player.vehicle.rotation : player.heading;

  let content = `Position: ${pos.x}, ${pos.y}, ${pos.z}`;

  if (player.vehicle) {
    content += ` | InCar | Rotation: ${(<Vector3>rot).x}, ${(<Vector3>rot).y}, ${(<Vector3>rot).z}`;
  } else {
    content += ` | OnFoot | Heading: ${rot}`;
  }

  content += ` - ${name}\r\n`;

  appendFile(saveFile, content, (err) => {
    if (err) {
      savePosLogger.error(`Error saving position: ${err.message}`);
    } else {
      savePosLogger.info(`Position saved: ${content}`);
    }
  });
}
