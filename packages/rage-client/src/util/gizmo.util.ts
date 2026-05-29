
// Configuration
const CONFIG = {
  moveSensitivity: 50,
  rotSensitivity: 800,
  enableScale: false,
};

// State management
interface GizmoState {
  enabled: boolean;
  cursorActive: boolean;
  currentMode: 'translate' | 'rotate';
  currentEntity: ObjectMp | null;
  currentButton: 'x' | 'y' | 'z' | '';
  oldPosition: Vector3 | null;
  oldRotation: Vector3 | null;
  oldCursorPos: [number, number];
  screenResolution: { x: number; y: number };
}


// Export interface
export interface GizmoResult {
  handle: number;
  position: Vector3;
  rotation: Vector3;
}


interface ScreenBox {
  x: number;
  y: number;
}

const state: GizmoState = {
  enabled: false,
  cursorActive: false,
  currentMode: 'translate',
  currentEntity: null,
  currentButton: '',
  oldPosition: null,
  oldRotation: null,
  oldCursorPos: [0, 0],
  screenResolution: { x: 0, y: 0 },
};

// Screen boxes for UI elements
let xBox: ScreenBox | undefined;
let yBox: ScreenBox | undefined;
let zBox: ScreenBox | undefined;
let switchBox: ScreenBox | undefined;
let groundBox: ScreenBox | undefined;
let cancelBox: ScreenBox | undefined;
let saveBox: ScreenBox | undefined;

// Initialize screen resolution
function initializeResolution(): void {
  const res = mp.game.graphics.getScreenActiveResolution(0, 0);
  state.screenResolution = { x: res.x, y: res.y };
}

// Utility functions
function normalize(x: number, y: number, z: number): [number, number, number] {
  const length = Math.sqrt(x * x + y * y + z * z);
  if (length === 0) {
    return [0, 0, 0];
  }
  return [x / length, y / length, z / length];
}

// Cursor management
function enterCursorMode(): void {
  mp.gui.cursor.show(true, true);
  state.cursorActive = true;
}

function leaveCursorMode(): void {
  mp.gui.cursor.show(false, false);
  state.cursorActive = false;
}

// Draw the 3D axis lines
function drawAxisLines(entity: ObjectMp): void {
  const pos = entity.position;

  // X axis (blue)
  mp.game.graphics.drawLine(
    pos.x - 1.0, pos.y, pos.z,
    pos.x + 1.0, pos.y, pos.z,
    0, 0, 255, 255
  );

  // Y axis (red)
  mp.game.graphics.drawLine(
    pos.x, pos.y - 1.0, pos.z,
    pos.x, pos.y + 1.0, pos.z,
    255, 0, 0, 255
  );

  // Z axis (green)
  mp.game.graphics.drawLine(
    pos.x, pos.y, pos.z - 1.0,
    pos.x, pos.y, pos.z + 1.0,
    0, 255, 0, 255
  );
}

// Draw the 2D UI elements
function drawUI(entity: ObjectMp): void {
  const pos = entity.position;

  // Convert 3D positions to 2D screen coordinates
  xBox = mp.game.graphics.world3dToScreen2d(new mp.Vector3(pos.x + 1.0, pos.y, pos.z));
  yBox = mp.game.graphics.world3dToScreen2d(new mp.Vector3(pos.x, pos.y + 1.0, pos.z));
  zBox = mp.game.graphics.world3dToScreen2d(new mp.Vector3(pos.x, pos.y, pos.z + 1.0));
  switchBox = mp.game.graphics.world3dToScreen2d(new mp.Vector3(pos.x - 0.8, pos.y - 0.8, pos.z));

  // Calculate button positions relative to switch box
  if (switchBox !== undefined) {
    groundBox = { x: switchBox.x + 0.065, y: switchBox.y };
    cancelBox = { x: switchBox.x + 0.13, y: switchBox.y };
    saveBox = { x: switchBox.x + 0.195, y: switchBox.y };
  } else {
    groundBox = undefined;
    cancelBox = undefined;
    saveBox = undefined;
  }

  // Draw X axis button
  if (xBox !== undefined) {
    mp.game.graphics.drawRect(xBox.x, xBox.y, 0.015, 0.026, 0, 0, 255, 255, false);
    mp.game.graphics.drawText('X', [xBox.x, xBox.y - 0.015], {
      font: 2,
      color: [255, 255, 255, 255],
      scale: [0.5, 0.5],
      outline: false,
    });
  }

  // Draw Y axis button
  if (yBox !== undefined) {
    mp.game.graphics.drawRect(yBox.x, yBox.y, 0.015, 0.026, 255, 0, 0, 255, false);
    mp.game.graphics.drawText('Y', [yBox.x, yBox.y - 0.016], {
      font: 2,
      color: [255, 255, 255, 255],
      scale: [0.5, 0.5],
      outline: false,
    });
  }

  // Draw Z axis button
  if (zBox !== undefined) {
    mp.game.graphics.drawRect(zBox.x, zBox.y, 0.015, 0.026, 0, 255, 0, 255, false);
    mp.game.graphics.drawText('Z', [zBox.x, zBox.y - 0.016], {
      font: 2,
      color: [255, 255, 255, 255],
      scale: [0.5, 0.5],
      outline: false,
    });
  }

  // Draw control buttons
  if (switchBox !== undefined) {
    const modeText = state.currentMode === 'translate' ? 'Rotate' : 'Move';

    mp.game.graphics.drawRect(switchBox.x, switchBox.y, 0.06, 0.026, 255, 255, 255, 255, false);
    mp.game.graphics.drawText(modeText, [switchBox.x, switchBox.y - 0.016], {
      font: 0,
      color: [0, 0, 0, 255],
      scale: [0.4, 0.4],
      outline: false,
    });
  }

  if (groundBox !== undefined) {
    mp.game.graphics.drawRect(groundBox.x, groundBox.y, 0.06, 0.026, 255, 255, 255, 255, false);
    mp.game.graphics.drawText('Ground', [groundBox.x, groundBox.y - 0.016], {
      font: 0,
      color: [0, 0, 0, 255],
      scale: [0.4, 0.4],
      outline: false,
    });
  }

  if (cancelBox !== undefined) {
    mp.game.graphics.drawRect(cancelBox.x, cancelBox.y, 0.06, 0.026, 255, 255, 255, 255, false);
    mp.game.graphics.drawText('Cancel', [cancelBox.x, cancelBox.y - 0.016], {
      font: 0,
      color: [0, 0, 0, 255],
      scale: [0.4, 0.4],
      outline: false,
    });
  }

  if (saveBox !== undefined) {
    mp.game.graphics.drawRect(saveBox.x, saveBox.y, 0.06, 0.026, 255, 255, 255, 255, false);
    mp.game.graphics.drawText('Save', [saveBox.x, saveBox.y - 0.016], {
      font: 0,
      color: [0, 0, 0, 255],
      scale: [0.4, 0.4],
      outline: false,
    });
  }
}

// Handle object transformation based on cursor movement
function handleTransformation(entity: ObjectMp): void {
  if (state.currentButton === '') return;

  const pos = mp.gui.cursor.position;
  const cursorDir = {
    x: (pos[0] - state.oldCursorPos[0]) / state.screenResolution.x,
    y: (pos[1] - state.oldCursorPos[1]) / state.screenResolution.y,
  };

  const mainPos = mp.game.graphics.world3dToScreen2d(
    new mp.Vector3(entity.position.x, entity.position.y, entity.position.z)
  );

  if (mainPos === undefined) {
    state.oldCursorPos = pos;
    return;
  }

  let refPos: ScreenBox | undefined;

  // Calculate transformation based on active button
  if (state.currentButton === 'x') {
    if (state.currentMode === 'translate') {
      refPos = mp.game.graphics.world3dToScreen2d(
        new mp.Vector3(entity.position.x + 1, entity.position.y, entity.position.z)
      );
      if (refPos !== undefined) {
        const screenDir = { x: refPos.x - mainPos.x, y: refPos.y - mainPos.y };
        const magnitude = cursorDir.x * screenDir.x + cursorDir.y * screenDir.y;
        entity.position = new mp.Vector3(
          entity.position.x + magnitude * CONFIG.moveSensitivity,
          entity.position.y,
          entity.position.z
        );
      }
    } else {
      refPos = mp.game.graphics.world3dToScreen2d(
        new mp.Vector3(entity.position.x, entity.position.y + 1, entity.position.z)
      );
      if (refPos !== undefined) {
        const screenDir = { x: refPos.x - mainPos.x, y: refPos.y - mainPos.y };
        const magnitude = cursorDir.x * screenDir.x + cursorDir.y * screenDir.y;
        entity.rotation = new mp.Vector3(
          entity.rotation.x - magnitude * CONFIG.rotSensitivity,
          entity.rotation.y,
          entity.rotation.z
        );
      }
    }
  } else if (state.currentButton === 'y') {
    if (state.currentMode === 'translate') {
      refPos = mp.game.graphics.world3dToScreen2d(
        new mp.Vector3(entity.position.x, entity.position.y + 1, entity.position.z)
      );
      if (refPos !== undefined) {
        const screenDir = { x: refPos.x - mainPos.x, y: refPos.y - mainPos.y };
        const magnitude = cursorDir.x * screenDir.x + cursorDir.y * screenDir.y;
        entity.position = new mp.Vector3(
          entity.position.x,
          entity.position.y + magnitude * CONFIG.moveSensitivity,
          entity.position.z
        );
      }
    } else {
      refPos = mp.game.graphics.world3dToScreen2d(
        new mp.Vector3(entity.position.x + 1, entity.position.y, entity.position.z)
      );
      if (refPos !== undefined) {
        const screenDir = { x: refPos.x - mainPos.x, y: refPos.y - mainPos.y };
        const magnitude = cursorDir.x * screenDir.x + cursorDir.y * screenDir.y;
        entity.rotation = new mp.Vector3(
          entity.rotation.x,
          entity.rotation.y + magnitude * CONFIG.rotSensitivity,
          entity.rotation.z
        );
      }
    }
  } else if (state.currentButton === 'z') {
    refPos = mp.game.graphics.world3dToScreen2d(
      new mp.Vector3(entity.position.x, entity.position.y, entity.position.z + 1)
    );
    if (refPos !== undefined) {
      const screenDir = { x: refPos.x - mainPos.x, y: refPos.y - mainPos.y };
      const magnitude = cursorDir.x * screenDir.x + cursorDir.y * screenDir.y;

      if (state.currentMode === 'translate') {
        entity.position = new mp.Vector3(
          entity.position.x,
          entity.position.y,
          entity.position.z + magnitude * CONFIG.moveSensitivity
        );
      } else {
        entity.rotation = new mp.Vector3(
          entity.rotation.x,
          entity.rotation.y,
          entity.rotation.z + cursorDir.x * CONFIG.rotSensitivity * 0.2
        );
      }
    }
  }

  state.oldCursorPos = pos;
}

// Button action handlers
function switchMode(): void {
  state.currentMode = state.currentMode === 'translate' ? 'rotate' : 'translate';
}

function groundObject(): void {
  if (!state.currentEntity) return;

  state.currentEntity.placeOnGroundProperly();
  const pos = state.currentEntity.getCoords(true);
  const rot = state.currentEntity.getRotation(2);

  state.currentEntity.position = new mp.Vector3(pos.x, pos.y, pos.z);
  state.currentEntity.rotation = new mp.Vector3(rot.x, rot.y, rot.z);
}

function cancel(): void {
  if (!state.currentEntity || !state.oldPosition || !state.oldRotation) return;

  state.currentEntity.position = state.oldPosition;
  state.currentEntity.rotation = state.oldRotation;
  state.currentEntity.setCollision(true, true);
  state.enabled = false;
}

function saveChanges(): void {
  if (!state.currentEntity) return;

  const pos = state.currentEntity.getCoords(true);
  const rot = state.currentEntity.getRotation(2);

  mp.events.call(
    'gizmo:finish',
    state.currentEntity.id,
    JSON.stringify(pos),
    JSON.stringify(rot)
  );

  state.currentEntity.setCollision(true, true);
  state.enabled = false;
}

// Check if mouse is within button bounds
function isMouseInBounds(
  mousePos: { x: number; y: number },
  box: ScreenBox | undefined,
  width: number,
  height: number
): boolean {
  if (box === undefined) return false;

  return (
    mousePos.x >= box.x - width &&
    mousePos.x <= box.x + width &&
    mousePos.y >= box.y - height &&
    mousePos.y <= box.y + height
  );
}

// Main gizmo loop
async function gizmoLoop(entity: ObjectMp): Promise<void> {
  if (!state.enabled) {
    leaveCursorMode();
    return;
  }

  initializeResolution();
  enterCursorMode();

  // Store original state
  state.oldPosition = entity.position;
  state.oldRotation = entity.getRotation(0);

  // Disable collision for editing
  entity.setCollision(false, false);

  // Visual feedback
  if (entity.type === 'ped') {
    entity.setAlpha(200);
  }

  while (state.enabled && entity.handle !== 0) {
    await mp.game.waitAsync(0);

    // Draw visual elements
    drawAxisLines(entity);
    drawUI(entity);

    // Handle transformation
    handleTransformation(entity);

    // Disable conflicting controls
    mp.game.controls.disableControlAction(0, 24, true); // LMB
    mp.game.controls.disableControlAction(0, 25, true); // RMB
  }

  // Cleanup
  if (state.cursorActive) {
    leaveCursorMode();
  }
  state.cursorActive = false;

  if (entity.handle !== 0) {
    if (entity.type === 'ped') {
      entity.setAlpha(255);
    }
  }

  state.currentEntity = null;
}

export async function useGizmo(entity: ObjectMp): Promise<GizmoResult> {
  state.enabled = true;
  state.currentEntity = entity;
  state.currentMode = 'translate';
  state.currentButton = '';

  await gizmoLoop(entity);

  return {
    handle: entity.handle,
    position: entity.position,
    rotation: entity.getRotation(0),
  };
}


// Event: Click handling
mp.events.add('click', (x: number, y: number, upOrDown: string) => {
  if (!state.currentEntity) return;

  const mouseRel = {
    x: x / state.screenResolution.x,
    y: y / state.screenResolution.y,
  };

  if (upOrDown === 'up') {
    state.currentButton = '';
  } else if (upOrDown === 'down') {
    // Check axis buttons
    if (isMouseInBounds(mouseRel, xBox, 0.01, 0.015)) {
      state.currentButton = 'x';
    } else if (isMouseInBounds(mouseRel, yBox, 0.01, 0.015)) {
      state.currentButton = 'y';
    } else if (isMouseInBounds(mouseRel, zBox, 0.01, 0.015)) {
      state.currentButton = 'z';
    }
    // Check control buttons
    else if (isMouseInBounds(mouseRel, switchBox, 0.03, 0.015)) {
      switchMode();
    } else if (isMouseInBounds(mouseRel, groundBox, 0.03, 0.015)) {
      groundObject();
    } else if (isMouseInBounds(mouseRel, cancelBox, 0.03, 0.015)) {
      cancel();
    } else if (isMouseInBounds(mouseRel, saveBox, 0.03, 0.015)) {
      saveChanges();
    }
  }
});

// Key bindings
mp.keys.bind(0x57, false, () => {
  // W key - Switch to translate mode
  if (!state.enabled) return;
  state.currentMode = 'translate';
});

mp.keys.bind(0x52, false, () => {
  // R key - Switch to rotate mode
  if (!state.enabled) return;
  state.currentMode = 'rotate';
});

mp.keys.bind(0x0d, false, () => {
  // ENTER key - Save and exit
  if (!state.enabled) return;
  saveChanges();
});

mp.keys.bind(0x1b, false, () => {
  // ESC key - Cancel and exit
  if (!state.enabled) return;
  cancel();
});

mp.keys.bind(0x12, false, () => {
  // LALT key - Ground object
  if (!state.enabled) return;
  groundObject();
});
