// Enums for better type safety
enum VisionMode {
  NORMAL = 0,
  NIGHT = 1,
  THERMAL = 2
}

enum DisplayMode {
  FULL = 0,
  BASIC = 1,
  OFF = 2
}

enum SpeedUnit {
  KMH = 'Km/h',
  MPH = 'MPH'
}

// Configuration
const CONFIG = {
  fov: { max: 80.0, min: 5.0 },
  speed: { zoom: 3.0, horizontal: 4.0, vertical: 4.0 },
  keys: {
    toggleCamera: 69,    // E
    toggleVision: 2,     // Right mouse
    toggleRappel: 88,    // X
    toggleSpotlight: 71, // G
    lockTarget: 32,      // Space
    toggleDisplay: 81,   // Q
    lightUp: 89,         // Y
    lightDown: 40,       // Down arrow
    radiusUp: 20,        // Caps Lock
    radiusDown: 16       // Left Shift
  },
  spotlight: {
    maxDistance: 700,
    brightness: { min: 1.0, max: 10.0, default: 1.0 },
    radius: { min: 4.0, max: 10.0, default: 4.0 }
  },
  speedUnit: SpeedUnit.KMH,
  validModels: ['polmav'],
  minHeight: 1.5,
  updateThreshold: 16, // ~60fps
  timeCycleModifier: 'heliGunCam',
  timeCycleStrength: 0.3
} as const;

// Conversion constants
const KMH_FRACTION = 3.6;
const MPH_FRACTION = 2.236936;

// State management
interface HelicamState {
  isActive: boolean;
  camera: CameraMp | null;
  fov: number;
  visionMode: VisionMode;
  displayMode: DisplayMode;
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

const state: HelicamState = {
  isActive: false,
  camera: null,
  fov: (CONFIG.fov.max + CONFIG.fov.min) * 0.5,
  visionMode: VisionMode.NORMAL,
  displayMode: DisplayMode.FULL,
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

// Utility functions
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

// Target management
function findVehicleInView(): VehicleMp | null {
  if (!state.camera) return null;

  const coords = state.camera.getCoord();
  const vehicles = mp.vehicles.toArray();

  let closestVehicle: VehicleMp | null = null;
  let closestDistance = Infinity;

  vehicles.forEach(vehicle => {
    const distance = getVehicleDistance({ position: coords } as VehicleMp, vehicle);

    if (distance < closestDistance && distance < 200) {
      closestVehicle = vehicle;
      closestDistance = distance;
    }
  });

  return closestVehicle;
}

function lockOntoTarget(vehicle: VehicleMp): void {
  unlockTarget(); // Clean up previous target

  state.lockedVehicle = vehicle;
  state.targetVehicle = vehicle;

  playUISound();

  if (state.spotlight.tracking) {
    mp.events.callRemote('heli:tracking.spotlight', vehicle.remoteId);
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

  // Note: In a real implementation, you'd get actual mouse/controller input
  const rightAxisX = 0; // Get from input system
  const rightAxisY = 0; // Get from input system

  if (rightAxisX === 0 && rightAxisY === 0) return;

  const rotation = state.camera.getRot(2);
  const zoomFactor = (1.0 / (CONFIG.fov.max - CONFIG.fov.min)) * (state.fov - CONFIG.fov.min);

  const newZ = rotation.z + rightAxisX * -1.0 * CONFIG.speed.vertical * (zoomFactor + 0.1);
  const newX = Math.max(Math.min(20.0, rotation.x + rightAxisY * -1.0 * CONFIG.speed.horizontal * (zoomFactor + 0.1)), -89.5);

  state.camera.setRot(newX, 0.0, newZ, 2);
}

function handleZoom(): void {
  if (!state.camera) return;

  let targetFov = state.fov;

  if (mp.keys.isDown(0x26)) { // Up arrow
    targetFov = Math.max(state.fov - CONFIG.speed.zoom, CONFIG.fov.min);
  }
  if (mp.keys.isDown(0x28)) { // Down arrow
    targetFov = Math.min(state.fov + CONFIG.speed.zoom, CONFIG.fov.max);
  }

  if (targetFov !== state.fov) {
    state.fov = targetFov;
    const currentFov = state.camera.getFov();
    state.camera.setFov(currentFov + (state.fov - currentFov) * 0.05);
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
  if (!mp.vehicles.exists(vehicle.handle) || state.displayMode === DisplayMode.OFF) return;

  const model = mp.game.vehicle.getDisplayNameFromVehicleModel(vehicle.model);
  const plate = mp.game.vehicle.getNumberPlateText(vehicle.handle);
  const speed = Math.ceil(getSpeedInConfiguredUnit(vehicle));

  // Setup text rendering
  mp.game.ui.setTextFont(0);
  mp.game.ui.setTextProportional(true);
  mp.game.ui.setTextScale(0.0, state.displayMode === DisplayMode.FULL ? 0.49 : 0.55);
  mp.game.ui.setTextColour(255, 255, 255, 255);
  mp.game.ui.setTextDropshadow(0, 0, 0, 0, 255);
  mp.game.ui.setTextEdge(1, 0, 0, 0, 255);
  mp.game.ui.setTextDropShadow();
  mp.game.ui.setTextOutline();
  mp.game.ui.setTextEntry('STRING');

  const displayText = state.displayMode === DisplayMode.FULL
    ? `Speed: ${speed} ${CONFIG.speedUnit}\nModel: ${model}\nPlate: ${plate}`
    : `Model: ${model}\nPlate: ${plate}`;

  mp.game.graphics.drawText(displayText,[0.45, 0.9]);
}

// Main system functions
function startHelicam(): void {
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

function stopHelicam(): void {
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

function toggleHelicam(): void {
  if (!isPlayerInValidHelicopter()) return;

  if (state.isActive) {
    stopHelicam();
  } else {
    startHelicam();
  }
}

function handleRappel(): void {
  if (!isPlayerInValidHelicopter()) return;

  // TODO: check seat
  // const seat = mp.players.local.seat;
  // if (seat === 1 || seat === 2) {
  //   playUISound();
  //   mp.gui.chat.push('Rappelling from helicopter...');
  //   // Note: Implement custom rappel logic here
  // } else {
  //   mp.gui.chat.push('!{red}Can\'t rappel from this seat');
  // }
}

// Main render handler
function helicamRenderHandler(): void {
  const currentTime = Date.now();
  if (currentTime - lastUpdateTime < CONFIG.updateThreshold) return;
  lastUpdateTime = currentTime;

  if (state.isActive) {
    const vehicle = mp.players.local.vehicle;
    if (!vehicle || !isHeightValid(vehicle)) {
      stopHelicam();
      return;
    }

    handleZoom();
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

  // Handle target distance check for non-camera mode
  if (state.targetVehicle && !state.isActive && isPlayerInValidHelicopter()) {
    const vehicle = mp.players.local.vehicle;
    if (vehicle) {
      const distance = getVehicleDistance(vehicle, state.targetVehicle);
      if (distance > CONFIG.spotlight.maxDistance) {
        unlockTarget();
      } else if (state.displayMode !== DisplayMode.OFF) {
        renderVehicleInfo(state.targetVehicle);
      }
    }
  }
}

// Event handlers
function playerEnterVehicleHandler(vehicle: VehicleMp, seat: number): void {
  if (!isValidHelicopter(vehicle)) return;

  // Auto-start systems based on seat and vehicle configuration
  // This could be extended with vehicle-specific data
}

function playerLeaveVehicleHandler(vehicle: VehicleMp): void {
  if (!isValidHelicopter(vehicle)) return;

  if (state.isActive) {
    stopHelicam();
  }
}

// Key bindings
mp.keys.bind(CONFIG.keys.toggleCamera, true, toggleHelicam);
mp.keys.bind(CONFIG.keys.toggleRappel, true, handleRappel);
mp.keys.bind(CONFIG.keys.toggleSpotlight, true, toggleSpotlight);
mp.keys.bind(CONFIG.keys.toggleDisplay, true, cycleDisplayMode);
mp.keys.bind(CONFIG.keys.lockTarget, true, () => {
  // TODO: Implement target locking logic
  // if (isPlayerInValidHelicopter() && mp.players.local.seat === 0 && state.targetVehicle) {
  //   unlockTarget();
  // }
});

// Helicam-specific controls
mp.keys.bind(CONFIG.keys.toggleVision, true, () => {
  if (state.isActive) cycleVisionMode();
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

// Initialize system
mp.events.add({
  render: helicamRenderHandler,
  playerEnterVehicle: playerEnterVehicleHandler,
  playerLeaveVehicle: playerLeaveVehicleHandler
});
