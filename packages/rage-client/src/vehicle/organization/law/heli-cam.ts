import { HexKeyCodes } from '@revolt-rp/common';
import { KMH_FRACTION } from '../../vehicle-core';
import { registerKeyBind } from '../../../core/keybind-manager';

enum VisionMode {
  NORMAL = 0,
  NIGHT = 1,
  THERMAL = 2
}

interface HeliCamState {
  isActive: boolean;
  camera: CameraMp | null;
  fov: number;
  visionMode: VisionMode;
  displayMode: CamDisplayMode;
  targetVehicle: VehicleMp | null;
  lockedVehicle: VehicleMp | null;
  spotlight: {
    manual: boolean;
    tracking: boolean;
    paused: boolean;
    brightness: number;
    radius: number;
  };
}

enum CamDisplayMode {
  FULL = 0,
  BASIC = 1,
  OFF = 2
}


const CONFIG = {
  fov: { max: 80.0, min: 5.0 },
  speed: { zoom: 3.0, horizontal: 4.0, vertical: 4.0 },
  keys: {
    toggleCamera: HexKeyCodes.E,
    toggleVision: HexKeyCodes.RightMouse,
    toggleSpotlight: HexKeyCodes.G,
    lockTarget: HexKeyCodes.Space,
    toggleDisplay: HexKeyCodes.Q,
    lightUp: HexKeyCodes.Y,
    lightDown: HexKeyCodes.Down,
    radiusUp: HexKeyCodes.CapsLock,
    radiusDown: HexKeyCodes.LeftShift
  },
  spotlight: {
    maxDistance: 700,
    brightness: { min: 1.0, max: 10.0, default: 1.0 },
    radius: { min: 4.0, max: 10.0, default: 4.0 }
  },
  validModels: ['polmav'],
  minHeight: 1.5,
  updateThreshold: 16, // ~60fps
  timeCycleModifier: 'heliGunCam',
  timeCycleStrength: 0.3
} as const;


const state: HeliCamState = {
  isActive: false,
  camera: null,
  fov: (CONFIG.fov.max + CONFIG.fov.min) * 0.5,
  visionMode: VisionMode.NORMAL,
  displayMode: CamDisplayMode.FULL,
  targetVehicle: null,
  lockedVehicle: null,
  spotlight: {
    manual: false,
    tracking: false,
    paused: false,
    brightness: CONFIG.spotlight.brightness.default,
    radius: CONFIG.spotlight.radius.default
  }
};

let lastUpdateTime = 0;

function isValidHelicopter(vehicle?: VehicleMp): boolean {
  if (!vehicle) return false;

  const modelName = mp.game.vehicle.getDisplayNameFromVehicleModel(vehicle.model);
  return CONFIG.validModels.some(model =>
    modelName.toLowerCase().includes(model.toLowerCase())
  );
}

function isHeightValid(vehicle: VehicleMp): boolean {
  return mp.game.entity.getHeightAboveGround(vehicle.handle) > CONFIG.minHeight;
}

function isPlayerInValidHelicopter(): boolean {
  const vehicle = mp.players.local.vehicle;
  return vehicle ? isValidHelicopter(vehicle) && isHeightValid(vehicle) : false;
}

function getSpeedInConfiguredUnit(vehicle: VehicleMp): number {
  return vehicle.getSpeed() * KMH_FRACTION;
}

function getVehicleDistance(vehicle1: VehicleMp, vehicle2: VehicleMp): number {
  return mp.game.system.vdist(
    vehicle1.position.x, vehicle1.position.y, vehicle1.position.z,
    vehicle2.position.x, vehicle2.position.y, vehicle2.position.z
  );
}

function rotationToVector(rotation: Vector3): Vector3 {
  const z = rotation.z * (Math.PI / 180);
  const x = rotation.x * (Math.PI / 180);
  const num = Math.abs(Math.cos(x));

  return new mp.Vector3(
    -Math.sin(z) * num,
    Math.cos(z) * num,
    Math.sin(x)
  );
}

function playUISound(): void {
  mp.game.audio.playSoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', false);
}

// Camera management
function createCamera(): void {
  const vehicle = mp.players.local.vehicle;
  if (!vehicle) return;

  state.camera = mp.cameras.new('default', vehicle.position, new mp.Vector3(0, 0, 0), CONFIG.fov.max);
  state.camera.attachTo(vehicle.handle, 0, 0, -1.5, true);
  state.camera.setRot(0, 0, vehicle.getHeading(), 2);
  state.camera.setFov(state.fov);
  state.camera.setActive(true);
}

function destroyCamera(): void {
  if (!state.camera) return;

  state.camera.setActive(false);
  state.camera.destroy();
  state.camera = null;
}

function resetCameraToFreeMode(): void {
  if (!state.camera || !mp.players.local.vehicle) return;

  const currentRotation = state.camera.getRot(2);
  const currentFov = state.camera.getFov();

  destroyCamera();
  createCamera();

  if (state.camera) {
    state.camera.setRot(currentRotation.x, currentRotation.y, currentRotation.z, 2);
    state.camera.setFov(currentFov);
  }
}

// Vision and display management
function applyVisionMode(): void {
  mp.game.graphics.setNightvision(state.visionMode === VisionMode.NIGHT);
  mp.game.graphics.setSeethrough(state.visionMode === VisionMode.THERMAL);
}

function cycleVisionMode(): void {
  state.visionMode = (state.visionMode + 1) % 3;
  applyVisionMode();
  playUISound();
}

function cycleDisplayMode(): void {
  state.displayMode = (state.displayMode + 1) % 3;
}

function findVehicleInView(): VehicleMp | null {
  if (!state.camera) return null;

  const coords = state.camera.getCoord();
  const rot = state.camera.getRot(2);

  const forwardVector = rotationToVector(rot);
  const maxDistance = 200.0;
  const targetPoint = new mp.Vector3(
    coords.x + forwardVector.x * maxDistance,
    coords.y + forwardVector.y * maxDistance,
    coords.z + forwardVector.z * maxDistance
  );

  const result = mp.raycasting.testPointToPoint(
    coords,
    targetPoint,
    mp.players.local,
    2
  );

  mp.game.graphics.drawLine(coords.x, coords.y, coords.z, targetPoint.x, targetPoint.y, targetPoint.z, 255, 0, 0, 255);
  if (result && result.entity && typeof result.entity === 'object') {
    return result.entity as VehicleMp;
  }

  return null;
}

function lockOntoTarget(): void {
  if (!isPlayerInValidHelicopter() || !state.isActive)
    return;

  unlockTarget();
  playUISound();

  const detectedVehicle = findVehicleInView();
  if (!detectedVehicle || !mp.vehicles.exists(detectedVehicle.handle)) {
    return;
  }
  if (state.spotlight.tracking) {
    //mp.events.callRemote('heli:tracking.spotlight', vehicle.remoteId);
  }
}

function unlockTarget(): void {
  if (state.spotlight.tracking) {
    mp.events.callRemote('heli:tracking.spotlight.toggle');
  }

  state.spotlight.tracking = false;
  state.spotlight.paused = false;
  state.targetVehicle = null;
  state.lockedVehicle = null;

  playUISound();
  resetCameraToFreeMode();
}

// Input handling
function handleCameraRotation(): void {
  if (!state.camera) return;

  const rightAxisX = mp.game.controls.getDisabledControlNormal(RageEnums.InputGroup.INPUTGROUP_MOVE, RageEnums.Controls.INPUT_SCRIPT_RIGHT_AXIS_X);
  const rightAxisY = mp.game.controls.getDisabledControlNormal(RageEnums.InputGroup.INPUTGROUP_MOVE, RageEnums.Controls.INPUT_SCRIPT_RIGHT_AXIS_Y);

  if (rightAxisX === 0 && rightAxisY === 0) return;

  const rotation = state.camera.getRot(2);
  const zoomFactor = (1.0 / (CONFIG.fov.max - CONFIG.fov.min)) * (state.fov - CONFIG.fov.min);

  const newZ = rotation.z + rightAxisX * -1.0 * CONFIG.speed.vertical * (zoomFactor + 0.1);
  const newX = Math.max(Math.min(20.0, rotation.x + rightAxisY * -1.0 * CONFIG.speed.horizontal * (zoomFactor + 0.1)), -89.5);

  state.camera.setRot(newX, 0.0, newZ, 2);
}

function handleHeliCamZoom(): void {
  if (!state.camera) return;

  let targetFov = state.fov;

  if (mp.game.controls.isDisabledControlPressed(RageEnums.InputGroup.INPUTGROUP_MOVE, RageEnums.Controls.INPUT_WEAPON_WHEEL_PREV)) {
    targetFov -= CONFIG.speed.zoom * 0.175;

    if (targetFov < CONFIG.fov.min) {
      targetFov = CONFIG.fov.min;
    }
  }

  if (mp.game.controls.isDisabledControlPressed(RageEnums.InputGroup.INPUTGROUP_MOVE, RageEnums.Controls.INPUT_WEAPON_WHEEL_NEXT)) {
    targetFov += CONFIG.speed.zoom * 0.175;
    if (targetFov > CONFIG.fov.max) {
      targetFov = CONFIG.fov.max;
    }
  }

  if (targetFov !== state.fov) {
    state.fov = targetFov;
    if (mp.cameras.exists(state.camera)) {
      state.camera.setFov(targetFov);
    }
  }
}

function handleLockedTarget(): void {
  if (!state.lockedVehicle || !state.camera) return;

  if (!mp.vehicles.exists(state.lockedVehicle.handle)) {
    unlockTarget();
    return;
  }

  const vehicle = mp.players.local.vehicle;
  if (vehicle) {
    const distance = getVehicleDistance(vehicle, state.lockedVehicle);
    if (distance > CONFIG.spotlight.maxDistance) {
      unlockTarget();
      return;
    }
  }

  state.camera.attachTo(state.lockedVehicle.handle, 0, 0, 0, true);
}

// Spotlight management
function adjustSpotlightBrightness(increase: boolean): void {
  if (!state.isActive) return;

  const newBrightness = increase
    ? Math.min(state.spotlight.brightness + 1, CONFIG.spotlight.brightness.max)
    : Math.max(state.spotlight.brightness - 1, CONFIG.spotlight.brightness.min);

  if (newBrightness !== state.spotlight.brightness) {
    state.spotlight.brightness = newBrightness;
    mp.events.callRemote(increase ? 'heli:light.up' : 'heli:light.down');
  }
}

function adjustSpotlightRadius(increase: boolean): void {
  if (!state.isActive) return;

  const newRadius = increase
    ? Math.min(state.spotlight.radius + 1, CONFIG.spotlight.radius.max)
    : Math.max(state.spotlight.radius - 1, CONFIG.spotlight.radius.min);

  if (newRadius !== state.spotlight.radius) {
    state.spotlight.radius = newRadius;
    mp.events.callRemote(increase ? 'heli:radius.up' : 'heli:radius.down');
  }
}

function toggleSpotlight(): void {
  if (!isPlayerInValidHelicopter() || mp.players.local.handle !== mp.players.local.vehicle.getPedInSeat(RageEnums.VehicleSeat.DRIVER)) return;

  if (state.targetVehicle) {
    if (state.spotlight.tracking) {
      state.spotlight.paused = !state.spotlight.paused;
      mp.events.callRemote('heli:pause.tracking.spotlight', state.spotlight.paused);
    } else {
      state.spotlight.paused = false;
      state.spotlight.tracking = true;
      mp.events.callRemote('heli:tracking.spotlight', state.targetVehicle.remoteId);
    }
  } else {
    if (state.spotlight.tracking) {
      state.spotlight.tracking = false;
      mp.events.callRemote('heli:tracking.spotlight.toggle');
    }

    mp.events.callRemote('heli:forward.spotlight', !state.spotlight.manual);
    state.spotlight.manual = !state.spotlight.manual;
  }

  playUISound();
}

// UI rendering
function hideHudElements(): void {
  mp.game.ui.hideHelpTextThisFrame();
  mp.game.ui.displayRadar(false);
  [19, 1, 2, 3, 4, 13, 11, 12, 15, 18].forEach(component => {
    mp.game.ui.hideHudComponentThisFrame(component);
  });
}

function renderVehicleInfo(vehicle: VehicleMp): void {
  if (!mp.vehicles.exists(vehicle.handle) || state.displayMode === CamDisplayMode.OFF) return;

  const model = mp.game.vehicle.getDisplayNameFromVehicleModel(vehicle.model);
  const plate = mp.game.vehicle.getNumberPlateText(vehicle.handle);
  const speed = Math.ceil(getSpeedInConfiguredUnit(vehicle));

}

// Main system functions
function startHeliCam(): void {
  if (state.isActive || !isPlayerInValidHelicopter()) return;

  // Apply visual effects
  mp.game.graphics.setTimecycleModifier(CONFIG.timeCycleModifier);
  mp.game.graphics.setTimecycleModifierStrength(CONFIG.timeCycleStrength);

  // Create and setup camera
  createCamera();

  if (state.camera) {
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    state.isActive = true;
  }
}

function stopHeliCam(): void {
  if (!state.isActive) return;

  // Handle spotlight transition
  if (state.spotlight.manual && state.targetVehicle) {
    state.spotlight.tracking = true;
    state.spotlight.paused = false;
    mp.events.callRemote('heli:tracking.spotlight', state.targetVehicle.remoteId);
  }

  // Cleanup
  state.spotlight.manual = false;
  destroyCamera();

  // Reset visual effects
  mp.game.graphics.clearTimecycleModifier();
  mp.game.graphics.setNightvision(false);
  mp.game.graphics.setSeethrough(false);
  mp.game.cam.renderScriptCams(false, false, 0, true, false);

  // Reset state
  state.isActive = false;
  state.fov = (CONFIG.fov.max + CONFIG.fov.min) * 0.5;
  state.visionMode = VisionMode.NORMAL;
}

function toggleHeliCam(): void {
  if (mp.players.local.isTypingInTextChat) return;
  if (!isPlayerInValidHelicopter()) return;

  if (state.isActive) {
    stopHeliCam();
  } else {
    startHeliCam();
  }
}


function heliCamRenderHandler(): void {
  const currentTime = Date.now();
  if (currentTime - lastUpdateTime < CONFIG.updateThreshold) return;
  lastUpdateTime = currentTime;

  if (state.isActive) {
    const vehicle = mp.players.local.vehicle;
    if (!vehicle || !isHeightValid(vehicle)) {
      stopHeliCam();
      return;
    }

    handleHeliCamZoom();
    handleCameraRotation();
    hideHudElements();

    if (state.lockedVehicle) {
      handleLockedTarget();
      renderVehicleInfo(state.lockedVehicle);
    } else {
      const detectedVehicle = findVehicleInView();
      if (detectedVehicle) {
        renderVehicleInfo(detectedVehicle);
      }
    }
  }

  if (state.targetVehicle && !state.isActive && isPlayerInValidHelicopter()) {
    const vehicle = mp.players.local.vehicle;
    if (vehicle) {
      const distance = getVehicleDistance(vehicle, state.targetVehicle);
      if (distance > CONFIG.spotlight.maxDistance) {
        unlockTarget();
      } else if (state.displayMode !== CamDisplayMode.OFF) {
        renderVehicleInfo(state.targetVehicle);
      }
    }
  }
}


function playerLeaveVehicleHandler(vehicle: VehicleMp): void {
  if (!isValidHelicopter(vehicle)) return;

  if (state.isActive) {
    stopHeliCam();
  }
}

registerKeyBind(CONFIG.keys.toggleCamera, true, toggleHeliCam);
registerKeyBind(CONFIG.keys.toggleSpotlight, true, toggleSpotlight);
registerKeyBind(CONFIG.keys.toggleDisplay, true, cycleDisplayMode);
registerKeyBind(CONFIG.keys.lockTarget, true, lockOntoTarget);


mp.events.add('click',
  (absoluteX: number,
   absoluteY: number,
   upOrDown: 'up' | 'down',
   leftOrRight: 'left' | 'right') => {
    if (upOrDown === 'down' && leftOrRight === 'right') {
      if (state.isActive)
        cycleVisionMode();
    }
  });

mp.keys.bind(CONFIG.keys.lightUp, true, () => adjustSpotlightBrightness(true));
mp.keys.bind(CONFIG.keys.lightDown, true, () => adjustSpotlightBrightness(false));
mp.keys.bind(CONFIG.keys.radiusUp, true, () => adjustSpotlightRadius(true));
mp.keys.bind(CONFIG.keys.radiusDown, true, () => adjustSpotlightRadius(false));

// Network events
mp.events.add('heli:forward.spotlight', (serverID: number, spotlightState: boolean) => {
  const player = mp.players.atRemoteId(serverID);
  if (player?.vehicle) {
    mp.game.vehicle.setSearchlight(player.vehicle.handle, spotlightState, false);
  }
});

mp.events.add('heli:tracking.spotlight', (serverID: number, targetId: number) => {
  const player = mp.players.atRemoteId(serverID);
  const target = mp.vehicles.atRemoteId(targetId);

  if (player?.vehicle && target) {
    // Implement tracking spotlight logic
    state.spotlight.tracking = true;
    state.spotlight.paused = false;
  }
});

mp.events.add('heli:tracking.spotlight.toggle', () => {
  state.spotlight.tracking = false;
});

mp.events.add('heli:pause.tracking.spotlight', (pause: boolean) => {
  state.spotlight.paused = pause;
});


mp.events.add({
  render: heliCamRenderHandler,
  playerLeaveVehicle: playerLeaveVehicleHandler
});
