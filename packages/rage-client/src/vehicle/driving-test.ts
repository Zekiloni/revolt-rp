import { on, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { DrivingTestMistakeType, ProcedureKey, VehicleSharedDataType } from '@revolt-rp/common';
import { getRoadProperties } from './map.util';
import { drivingTestCheckpoints } from './driving-test.config';
import { browser } from '../core/browser';
import { KMH_FRACTION } from './vehicle-core';
import { setCheckpointDirection } from '../util/checkpoint.util';
import { getDistance } from '../util/vector.util';


const MISTAKE_CHECK_INTERVAL = 1000,
  MISTAKE_COOLDOWN = 3000;
const OFF_ROAD_DISTANCE = 25;
const vehicleInstructor: Record<number, PedMp> = {};
let isDrivingTestActive = false;
let currentCheckpointIndex: null | number = null;
let lastMistakeAt: number | null = null;
let lastBodyHealth: number | null = null;
let drivingMistakes: DrivingTestMistakeType[] = [];
let mistakeCheckInterval: NodeJS.Timeout | null = null;

let initialPosition: Vector3 | null = null;
const INSTRUCTOR_MODEL = mp.game.joaat('ig_andreas');


function drivingTestChecker() {
  const vehicle = mp.players.local.vehicle;
  if (!vehicle)
    return;

  const { x, y, z } = mp.players.local.position;
  const roadProperties = getRoadProperties(x, y, z);

  if (roadProperties.speedLimit && roadProperties.speedLimit != -1)
    triggerBrowser(browser, ProcedureKey.BROWSER_SET_SPEED_LIMIT, roadProperties.speedLimit);

  const currentTime = Date.now();
  let mistake: DrivingTestMistakeType | null = null

  if ((vehicle.getSpeed() * KMH_FRACTION) > roadProperties.speedLimit) {
    if (!lastMistakeAt || currentTime - lastMistakeAt >= MISTAKE_COOLDOWN) {
      mistake = DrivingTestMistakeType.Speeding;
    }
  }

  if (!roadProperties.isOnRoad) {
    const distance = getDistance(vehicle.position, initialPosition);
    if (distance > OFF_ROAD_DISTANCE) {
      if (!lastMistakeAt || currentTime - lastMistakeAt >= MISTAKE_COOLDOWN) {
        mistake = DrivingTestMistakeType.OffRoadDriving;
      }
    }
  }

  if (lastBodyHealth && vehicle.getBodyHealth() < lastBodyHealth) {
    if (!lastMistakeAt || currentTime - lastMistakeAt >= MISTAKE_COOLDOWN) {
      mistake = DrivingTestMistakeType.Collision;
    }
  }

  if (mistake) {
    lastMistakeAt = currentTime;
    drivingMistakes.push(mistake);
    triggerServer(ProcedureKey.SERVER_ADD_DRIVING_TEST_MISTAKE, mistake);
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

  const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);

  const checkpoint = mp.checkpoints.new(1, new mp.Vector3(position.x, position.y, getGroundZ ? getGroundZ : position.z - 1.25), 3, {
    dimension: mp.players.local.dimension,
    color: [220, 30, 30, 200],
    direction: new mp.Vector3(positionSecond.x, positionSecond.y, positionSecond.z),
    visible: true
  });

  mp.game.ui.setNewWaypoint(checkpoint.position.x, checkpoint.position.y);

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

      const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
      checkpoint.position = new mp.Vector3(position.x, position.y, getGroundZ ? getGroundZ : position.z - 1.25);
      if (positionSecond) {
        setCheckpointDirection(checkpoint, new mp.Vector3(positionSecond.x, positionSecond.y, positionSecond.z));
      }

      mp.game.ui.setNewWaypoint(checkpoint.position.x, checkpoint.position.y);
    }
  };

  mp.events.add('playerEnterCheckpoint', playerEnterDrivingTestCheckpoint);
}

const isInstructorPedAlreadyInVehicle = (vehicle: VehicleMp) => {
  const ped = vehicleInstructor[vehicle.remoteId];
  return ped && mp.peds.exists(ped);
};

async function syncVehicleInstructorPed(vehicle: VehicleMp, value: boolean) {
  if (value) {
    if (isInstructorPedAlreadyInVehicle(vehicle))
      return;

    const ped = mp.peds.new(INSTRUCTOR_MODEL, vehicle.position, 0);
    vehicleInstructor[vehicle.remoteId] = ped;

    while (ped.handle === 0) {
      await mp.game.waitAsync(0);
    }

    ped.taskEnterVehicle(vehicle.handle, 100, RageEnums.VehicleSeat.PASSENGER, 1.0, 16, 0);
  } else {
    const ped = vehicleInstructor[vehicle.remoteId];
    if (!ped)
      return;

    if (mp.peds.exists(ped)) {
      ped.destroy();
    }

    delete vehicleInstructor[vehicle.remoteId];
  }
}

async function vehicleDrivingTestDataHandler(vehicle: VehicleMp, value: boolean, _oldValue: boolean = undefined) {
  if (vehicle.type != RageEnums.EntityType.VEHICLE)
    return;

  await syncVehicleInstructorPed(vehicle, value);
}

async function vehicleDrivingTestStreamInHandler(vehicle: VehicleMp) {
  if (vehicle.type != RageEnums.EntityType.VEHICLE)
    return;

  const value = vehicle.getVariable(VehicleSharedDataType.DrivingTest);
  if (value) {
    await vehicleDrivingTestDataHandler(vehicle, value);
  }
}


mp.events.addDataHandler(VehicleSharedDataType.DrivingTest, vehicleDrivingTestDataHandler);
mp.events.add({ entityStreamIn: vehicleDrivingTestStreamInHandler });
on(ProcedureKey.CLIENT_START_DRIVING_TEST, initializeDrivingTest);
