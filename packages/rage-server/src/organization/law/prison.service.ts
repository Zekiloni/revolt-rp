import dayjs from 'dayjs';
import { ICriminalRecordCreate, PropertyPointType, RecordType } from '@revolt-rp/common';
import { CriminalRecordModel, Property } from '@revolt-rp/core';
import { getActiveArrestByCharacterId } from './criminal-record/criminal-record.service';


export const arrestPlayer = async (player: PlayerMp, target: PlayerMp, record: ICriminalRecordCreate) => {
  const minutes = record.charges.reduce((total, charge) => total + charge.jailTime, 0);

  await CriminalRecordModel.create({
    ...record,
    target: target.character,
    officer: player.character,
    type: RecordType.Arrest,
    released: false,
    expiringAt: dayjs().add(minutes, 'minutes').toDate()
  });

  putInPrison(player, /* prison property based on record */ null, true);

  // TODO: notify target player of arrest
};

export const putInPrison = (player: PlayerMp, prison: Property, teleport = false) => {
  const randomCell = prison.points.find(point => point.type === PropertyPointType.SpawnPoint);
  if (randomCell) {
    const position = new mp.Vector3(randomCell.position.x, randomCell.position.y, randomCell.position.z);
    player.character.position = position;
    player.character.dimension = randomCell.dimension;
    if (teleport) {
      player.position = position;
      player.dimension = randomCell.dimension;
    }
  }
};


export const releaseFromPrison = async (player: PlayerMp) => {
  const activeArrest = await getActiveArrestByCharacterId(player.character.id);
  if (!activeArrest) {
    throw new Error('no_active_arrest');
  }

  activeArrest.released = true;
  await activeArrest.save();

  const prison = (<Property>activeArrest.prisonProperty);
  const exitPoint = prison.points.find(point => point.type === PropertyPointType.MainPoint);
  const { x, y, z } = exitPoint.position || prison.position;
  const dimension = exitPoint.dimension || prison.dimension;

  player.character.position = new mp.Vector3(x, y, z);
  player.character.dimension = dimension;

  player.position = new mp.Vector3(x, y, z);
  player.dimension = dimension;

  // TODO: Notify player of release
}

