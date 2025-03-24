import { on, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { DrivingTestMistakeType, ProcedureKey } from '@revolt-rp/common';
import { getRoadProperties } from './map.util';
import { drivingTestCheckpoints } from './driving-test.config';
import { browser } from '../core/browser';
import { KMH_FRACTION } from './vehicle-core';
import { setCheckpointDirection } from '../util/checkpoint.util';
import { getDistance } from '../util/vector.util';


const MISTAKE_CHECK_INTERVAL = 1000,
  MISTAKE_COOLDOWN = 3000;
let isDrivingTestActive = false;
let currentCheckpointIndex: null | number = null;
let lastMistakeAt: number | null = null;
let lastBodyHealth: number | null = null;
let drivingMistakes: DrivingTestMistakeType[] = [];
let mistakeCheckInterval: NodeJS.Timeout | null = null;
let initialPosition: Vector3 | null = null;
const OFF_ROAD_DISTANCE = 25;


function drivingTestChecker() {
  const vehicle = mp.players.local.vehicle;
  if (!vehicle)
    return;

  const { x, y, z } = mp.players.local.position;
  const roadProperties = getRoadProperties(x, y, z);

  if (roadProperties.speedLimit && roadProperties.speedLimit != -1)
    triggerBrowser(browser, ProcedureKey.BROWSER_SET_SPEED_LIMIT, roadProperties.speedLimit);

  const currentTime = Date.now();

  if ((vehicle.getSpeed() * KMH_FRACTION) > roadProperties.speedLimit) {
    if (!lastMistakeAt || currentTime - lastMistakeAt >= MISTAKE_COOLDOWN) {
      drivingMistakes.push(DrivingTestMistakeType.Speeding);
      lastMistakeAt = currentTime;
    }
  }

  if (!roadProperties.isOnRoad) {
    const distance = getDistance(vehicle.position, initialPosition);
    if (distance > OFF_ROAD_DISTANCE) {
      if (!lastMistakeAt || currentTime - lastMistakeAt >= MISTAKE_COOLDOWN) {
        drivingMistakes.push(DrivingTestMistakeType.OffRoadDriving);
        lastMistakeAt = currentTime;
      }
    }
  }

  if (lastBodyHealth && vehicle.getBodyHealth() < lastBodyHealth) {
    if (!lastMistakeAt || currentTime - lastMistakeAt >= MISTAKE_COOLDOWN) {
      drivingMistakes.push(DrivingTestMistakeType.Collision);
      lastMistakeAt = currentTime;
    }
  }

  lastBodyHealth = vehicle.getBodyHealth();
}

function initializeDrivingTest(vehicle: VehicleMp) {
  if (isDrivingTestActive) {
    return;
  }

  isDrivingTestActive = true;

  const [position, positionSecond] = drivingTestCheckpoints;
  currentCheckpointIndex = drivingTestCheckpoints.indexOf(position);

  const checkpoint = mp.checkpoints.new(1, new mp.Vector3(position.x, position.y, position.z - 2), 3, {
    dimension: mp.players.local.dimension,
    color: [255, 255, 255, 255],
    direction: new mp.Vector3(positionSecond.x, positionSecond.y, positionSecond.z),
    visible: true
  });

  mistakeCheckInterval = setInterval(drivingTestChecker, MISTAKE_CHECK_INTERVAL);
  lastBodyHealth = vehicle.getBodyHealth();
  initialPosition = vehicle.position;

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

      triggerBrowser(browser, ProcedureKey.BROWSER_SET_SPEED_LIMIT, null);
      triggerServer(ProcedureKey.SERVER_FINISH_DRIVING_TEST, drivingMistakes);

      isDrivingTestActive = false;

      lastMistakeAt = null;
      drivingMistakes = [];

      if (mistakeCheckInterval)
        clearInterval(mistakeCheckInterval);

      mistakeCheckInterval = null;
      lastBodyHealth = null;
      initialPosition = null;

      mp.events.remove('playerEnterCheckpoint', playerEnterDrivingTestCheckpoint);
    } else {
      currentCheckpointIndex++;
      const position = drivingTestCheckpoints[currentCheckpointIndex];
      const positionSecond = drivingTestCheckpoints[currentCheckpointIndex + 1];

      checkpoint.position = new mp.Vector3(position.x, position.y, position.z);
      if (positionSecond) {
        setCheckpointDirection(checkpoint, new mp.Vector3(positionSecond.x, positionSecond.y, positionSecond.z));
      }

      mp.game.ui.setNewWaypoint(checkpoint.position.x, checkpoint.position.y);
    }
  };

  mp.events.add('playerEnterCheckpoint', playerEnterDrivingTestCheckpoint);
}

on(ProcedureKey.CLIENT_START_DRIVING_TEST, initializeDrivingTest);
