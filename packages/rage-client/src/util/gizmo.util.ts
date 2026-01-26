
/**
 * 3D Gizmo System for RageMP
 * Credits:
 * - Andyyy7666: https://github.com/overextended/ox_lib/pull/453
 * - AvarianKnight: https://forum.cfx.re/t/allow-drawgizmo-to-be-used-outside-of-fxdk/5091845/8?u=demi-automatic
 */

import { DataView } from './dataview.util';

// Configuration
const CONFIG = {
  enableScale: false, // Scaling mode (doesn't scale collisions and resets when physics are applied)
};

// State management
interface GizmoState {
  enabled: boolean;
  cursorActive: boolean;
  currentMode: 'translate' | 'rotate' | 'scale';
  isRelative: boolean;
  currentEntity: EntityMp | null;
}

const state: GizmoState = {
  enabled: false,
  cursorActive: false,
  currentMode: 'translate',
  isRelative: false,
  currentEntity: null,
};

// Utility functions
function normalize(x: number, y: number, z: number): [number, number, number] {
  const length = Math.sqrt(x * x + y * y + z * z);
  if (length === 0) {
    return [0, 0, 0];
  }
  return [x / length, y / length, z / length];
}

function makeEntityMatrix(entity: EntityMp): DataView {
  const matrix = mp.game.entity.getMatrix(entity.handle)
  const view = new DataView(64);

  // Right vector
  view.setFloat32(0, matrix.rightVector.x);
  view.setFloat32(4, matrix.rightVector.y);
  view.setFloat32(8, matrix.rightVector.z);
  view.setFloat32(12, 0);

  // Forward vector
  view.setFloat32(16, matrix.forwardVector.x);
  view.setFloat32(20, matrix.forwardVector.y);
  view.setFloat32(24, matrix.forwardVector.z);
  view.setFloat32(28, 0);

  // Up vector
  view.setFloat32(32, matrix.upVector.x);
  view.setFloat32(36, matrix.upVector.y);
  view.setFloat32(40, matrix.upVector.z);
  view.setFloat32(44, 0);

  // Position
  view.setFloat32(48, matrix.position.x);
  view.setFloat32(52, matrix.position.y);
  view.setFloat32(56, matrix.position.z);
  view.setFloat32(60, 1);

  return view;
}

function applyEntityMatrix(entity: EntityMp, view: DataView): void {
  let x1 = view.getFloat32(16);
  let y1 = view.getFloat32(20);
  let z1 = view.getFloat32(24);

  let x2 = view.getFloat32(0);
  let y2 = view.getFloat32(4);
  let z2 = view.getFloat32(8);

  let x3 = view.getFloat32(32);
  let y3 = view.getFloat32(36);
  let z3 = view.getFloat32(40);

  const tx = view.getFloat32(48);
  const ty = view.getFloat32(52);
  const tz = view.getFloat32(56);

  if (!CONFIG.enableScale) {
    [x1, y1, z1] = normalize(x1, y1, z1);
    [x2, y2, z2] = normalize(x2, y2, z2);
    [x3, y3, z3] = normalize(x3, y3, z3);
  }

  // Apply matrix to entity
  // Note: RageMP might handle this differently - adjust as needed
  entity.setMatrix([
    new mp.Vector3(x2, y2, z2), // right
    new mp.Vector3(x1, y1, z1), // forward
    new mp.Vector3(x3, y3, z3), // up
    new mp.Vector3(tx, ty, tz)  // position
  ]);
}

// Cursor management
function enterCursorMode(): void {
  mp.gui.cursor.visible = true;
  state.cursorActive = true;
}

function leaveCursorMode(): void {
  mp.gui.cursor.visible = false;
  state.cursorActive = false;
}

// Vector text helpers
function getVectorText(vectorType: 'coords' | 'rotation'): string {
  if (!state.currentEntity) {
    return `ERR_NO_ENTITY_${vectorType.toUpperCase()}`;
  }

  const label = vectorType === 'coords' ? 'Position' : 'Rotation';
  const vec = vectorType === 'coords'
    ? state.currentEntity.position
    : state.currentEntity.getRotation(0);

  return `${label}: ${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}, ${vec.z.toFixed(2)}`;
}

// Main gizmo loop
async function gizmoLoop(entity: EntityMp): Promise<void> {
  if (!state.enabled) {
    leaveCursorMode();
    return;
  }

  enterCursorMode();

  // Visual feedback
  if (entity.type === 'ped') {
    entity.setAlpha(200);
  } else {
    // RageMP equivalent for outline - may need adjustment
    entity.drawOutline = true;
  }

  while (state.enabled && entity.handle !== 0) {
    await mp.game.waitAsync(0);

    // Toggle cursor with G key
    if (mp.keys.isDown(0x47)) { // G key
      if (state.cursorActive) {
        leaveCursorMode();
      } else {
        enterCursorMode();
      }
    }

    // Disable controls
    mp.game.controls.disableControlAction(0, 24, true);  // LMB
    mp.game.controls.disableControlAction(0, 25, true);  // RMB
    mp.game.controls.disableControlAction(0, 140, true); // R

    // Process gizmo transformation
    const matrixBuffer = makeEntityMatrix(entity);

    // Note: RageMP doesn't have direct gizmo support like FiveM
    // You'll need to implement your own gizmo rendering/interaction
    // This is a placeholder for the transformation logic
    const changed = processGizmoTransform(entity, matrixBuffer);

    if (changed) {
      applyEntityMatrix(entity, matrixBuffer);
    }
  }

  if (state.cursorActive) {
    leaveCursorMode();
  }
  state.cursorActive = false;

  if (entity.handle !== 0) {
    if (entity.type === 'ped') {
      entity.setAlpha(255);
    }
    entity.drawOutline = false;
  }

  state.enabled = false;
  state.currentEntity = null;
}

// Placeholder for gizmo transform processing
function processGizmoTransform(entity: EntityMp, matrixBuffer: DataView): boolean {
  // This needs to be implemented based on your gizmo rendering solution
  // RageMP doesn't have built-in gizmo support like FiveM
  // You might need to use CEF/browser for UI or implement custom 3D rendering
  return false;
}


export interface GizmoResult {
  handle: number;
  position: Vector3;
  rotation: Vector3;
}

export async function useGizmo(entity: EntityMp): Promise<GizmoResult> {
  state.enabled = true;
  state.currentEntity = entity;

  await gizmoLoop(entity);

  return {
    handle: entity.handle,
    position: entity.position,
    rotation: entity.getRotation(0),
  };
}

// Key bindings
mp.keys.bind(0x57, false, () => { // W
  if (!state.enabled) return;
  state.currentMode = 'translate';
});

mp.keys.bind(0x52, false, () => { // R
  if (!state.enabled) return;
  state.currentMode = 'rotate';
});

mp.keys.bind(0x51, false, () => { // Q
  if (!state.enabled) return;
  state.isRelative = !state.isRelative;
});

mp.keys.bind(0x0D, false, () => { // ENTER
  if (!state.enabled) return;
  state.enabled = false;
});

mp.keys.bind(0x12, false, () => { // LALT
  if (!state.enabled || !state.currentEntity) return;

  const groundZ = mp.game.gameplay.getGroundZFor3dCoord(
    state.currentEntity.position.x,
    state.currentEntity.position.y,
    state.currentEntity.position.z + 100,
    false,
    false
  );

  state.currentEntity.position = new mp.Vector3(
    state.currentEntity.position.x,
    state.currentEntity.position.y,
    groundZ
  );
});

if (CONFIG.enableScale) {
  mp.keys.bind(0x53, false, () => { // S
    if (!state.enabled) return;
    state.currentMode = 'scale';
  });
}
