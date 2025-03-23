import { on, triggerServer } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { drivingTestCheckpoints } from './driving-test.config';


let isDrivingTestActive = false;
let currentCheckpointIndex: null | number = null;

function initializeDrivingTest(vehicle: VehicleMp) {
  if (isDrivingTestActive) {
    return;
  }

  isDrivingTestActive = true;

  const [position] = drivingTestCheckpoints;
  currentCheckpointIndex = drivingTestCheckpoints.indexOf(position);

  const checkpoint = mp.checkpoints.new(1, new mp.Vector3(position.x, position.y, position.z), 3, {
    dimension: mp.players.local.dimension,
    color: [255, 255, 255, 255],
    visible: true
  });

  const playerEnterDrivingTestCheckpoint = (enteredCheckpoint: CheckpointMp) => {
    if (!mp.players.local.vehicle) {
      return;
    }

    if (mp.players.local.vehicle.remoteId != vehicle.remoteId) {
      return;
    }

    if (checkpoint.id != enteredCheckpoint.id) {
      return;
    }

    if (currentCheckpointIndex >= drivingTestCheckpoints.length - 1) {
      currentCheckpointIndex = null;

      if (checkpoint && mp.checkpoints.exists(checkpoint)) {
        checkpoint.destroy();
      }

      triggerServer(ProcedureKey.SERVER_FINISH_DRIVING_TEST);
      isDrivingTestActive = false;

      mp.events.remove('playerEnterCheckpoint', playerEnterDrivingTestCheckpoint);
    } else {
      currentCheckpointIndex++;
      const position = drivingTestCheckpoints[currentCheckpointIndex];
      checkpoint.position = new mp.Vector3(position.x, position.y, position.z);

      mp.game.ui.setNewWaypoint(checkpoint.position.x, checkpoint.position.y);
    }
  };

  mp.events.add('playerEnterCheckpoint', playerEnterDrivingTestCheckpoint);
}

on(ProcedureKey.CLIENT_START_DRIVING_TEST, initializeDrivingTest);
