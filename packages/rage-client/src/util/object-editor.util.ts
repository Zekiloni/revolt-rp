/**
 * Furniture/Object Editor System for RageMP
 * Ported from C# RAGE.NET implementation
 *
 * Features:
 * - Right-click to select and drag objects
 * - X/Y/Z axis locking with keyboard
 * - Rotate/Position mode toggle
 * - Snap to XYZ (free positioning)
 * - Ground snapping
 * - Visual feedback with colored boxes
 */

// Configuration
const CONFIG = {
  moveOffsetPerPixel: 0.005, // For Z-axis movement
  rotationOffset: 1.0,        // Degrees per update
  selectionDistance: 100.0,   // Max raycast distance
  boxSize: 0.4,              // Visual selection box size
  alertDuration: 5000,       // Alert display time (ms)
};

// State management
interface EditorState {
  isEditMode: boolean;

  // Movement/Rotation mode flags
  movingX: boolean;
  movingY: boolean;
  movingZ: boolean;
  rotationX: boolean;
  rotationY: boolean;
  rotationZ: boolean;
  isRotating: boolean;

  // Selected object
  selectedObject: ObjectMp | null;
  selectedObjectDBID: number | null;

  // Drag tracking
  dragStartWorldPos: Vector3 | null;
  lastCursorPos: { x: number; y: number } | null;

  // Alert system
  alertMessage: string | null;
  alertCreatedTime: number;
}

const state: EditorState = {
  isEditMode: false,

  movingX: true,
  movingY: true,
  movingZ: true,
  rotationX: false,
  rotationY: false,
  rotationZ: true,
  isRotating: false,

  selectedObject: null,
  selectedObjectDBID: null,

  dragStartWorldPos: null,
  lastCursorPos: null,

  alertMessage: null,
  alertCreatedTime: 0,
};

// Utility functions
function getGroundPosition(pos: Vector3): number {
  return mp.game.gameplay.getGroundZFor3dCoord(
    pos.x,
    pos.y,
    pos.z + 100.0,
    0,
    false
  );
}

function getWorldPositionFromScreenPosition(screenPos: { x: number; y: number }): Vector3 | null {
  const camera = mp.cameras.gameplay;
  const camPos = camera.getCoord();
  const camRot = camera.getRot(2);

  // Convert screen to world
  const farAway = 1000.0;
  const screenX = (screenPos.x / mp.game.graphics.getScreenActiveResolution(0, 0).x) * 2.0 - 1.0;
  const screenY = 1.0 - (screenPos.y / mp.game.graphics.getScreenActiveResolution(0, 0).y) * 2.0;

  // Calculate direction from camera
  const dirX = Math.sin(camRot.z * Math.PI / 180) * Math.cos(camRot.x * Math.PI / 180);
  const dirY = Math.cos(camRot.z * Math.PI / 180) * Math.cos(camRot.x * Math.PI / 180);
  const dirZ = Math.sin(camRot.x * Math.PI / 180);

  const targetPos = new mp.Vector3(
    camPos.x + dirX * farAway,
    camPos.y + dirY * farAway,
    camPos.z + dirZ * farAway
  );

  return targetPos;
}

function raycastFromCamera(): { hit: boolean; position: Vector3 | null; entity: EntityMp | null } {
  const camera = mp.cameras.gameplay;
  const camPos = camera.getCoord();
  const cursorPos = mp.gui.cursor.position;
  const targetPos = getWorldPositionFromScreenPosition({ x: cursorPos[0], y: cursorPos[1] });

  if (!targetPos) {
    return { hit: false, position: null, entity: null };
  }

  // Raycast from camera to target
  const raycast = mp.raycasting.testPointToPoint(
    camPos,
    targetPos,
    mp.players.local,
    (1 | 16) // Vehicles and objects
  );

  if (raycast) {
    return {
      hit: true,
      position: raycast.position,
      entity: raycast.entity
    };
  }

  return { hit: false, position: null, entity: null };
}

// Alert system
function showAlert(message: string): void {
  state.alertMessage = message;
  state.alertCreatedTime = Date.now();
}

function handleXYZAlert(): void {
  if (!state.isRotating && state.movingX && state.movingY && state.movingZ) {
    showAlert("Switched to 'Snap to XYZ' mode");
  } else {
    if (state.isRotating) {
      if (state.rotationX) {
        showAlert("Rotating on the X axis");
      } else if (state.rotationY) {
        showAlert("Rotating on the Y axis");
      } else if (state.rotationZ) {
        showAlert("Rotating on the Z axis");
      }
    } else {
      if (state.movingX) {
        showAlert("Positioning on the X axis");
      } else if (state.movingY) {
        showAlert("Positioning on the Y axis");
      } else if (state.movingZ) {
        showAlert("Positioning on the Z axis");
      }
    }
  }
}

// Visual rendering
function drawSelectionBox(position: Vector3, color: { r: number; g: number; b: number; a: number }): void {
  const size = CONFIG.boxSize;

  // Draw box using lines (RageMP doesn't have DrawBox, so we draw a wireframe)
  const corners = [
    new mp.Vector3(position.x - size/2, position.y - size/2, position.z - size/2),
    new mp.Vector3(position.x + size/2, position.y - size/2, position.z - size/2),
    new mp.Vector3(position.x + size/2, position.y + size/2, position.z - size/2),
    new mp.Vector3(position.x - size/2, position.y + size/2, position.z - size/2),
    new mp.Vector3(position.x - size/2, position.y - size/2, position.z + size/2),
    new mp.Vector3(position.x + size/2, position.y - size/2, position.z + size/2),
    new mp.Vector3(position.x + size/2, position.y + size/2, position.z + size/2),
    new mp.Vector3(position.x - size/2, position.y + size/2, position.z + size/2),
  ];

  // Bottom face
  mp.game.graphics.drawLine(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, color.r, color.g, color.b, color.a);
  mp.game.graphics.drawLine(corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, color.r, color.g, color.b, color.a);
  mp.game.graphics.drawLine(corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, color.r, color.g, color.b, color.a);
  mp.game.graphics.drawLine(corners[3].x, corners[3].y, corners[3].z, corners[0].x, corners[0].y, corners[0].z, color.r, color.g, color.b, color.a);

  // Top face
  mp.game.graphics.drawLine(corners[4].x, corners[4].y, corners[4].z, corners[5].x, corners[5].y, corners[5].z, color.r, color.g, color.b, color.a);
  mp.game.graphics.drawLine(corners[5].x, corners[5].y, corners[5].z, corners[6].x, corners[6].y, corners[6].z, color.r, color.g, color.b, color.a);
  mp.game.graphics.drawLine(corners[6].x, corners[6].y, corners[6].z, corners[7].x, corners[7].y, corners[7].z, color.r, color.g, color.b, color.a);
  mp.game.graphics.drawLine(corners[7].x, corners[7].y, corners[7].z, corners[4].x, corners[4].y, corners[4].z, color.r, color.g, color.b, color.a);

  // Vertical edges
  mp.game.graphics.drawLine(corners[0].x, corners[0].y, corners[0].z, corners[4].x, corners[4].y, corners[4].z, color.r, color.g, color.b, color.a);
  mp.game.graphics.drawLine(corners[1].x, corners[1].y, corners[1].z, corners[5].x, corners[5].y, corners[5].z, color.r, color.g, color.b, color.a);
  mp.game.graphics.drawLine(corners[2].x, corners[2].y, corners[2].z, corners[6].x, corners[6].y, corners[6].z, color.r, color.g, color.b, color.a);
  mp.game.graphics.drawLine(corners[3].x, corners[3].y, corners[3].z, corners[7].x, corners[7].y, corners[7].z, color.r, color.g, color.b, color.a);
}

function drawUI(): void {
  if (!state.isEditMode) return;

  const fontScale = 0.4;
  const startY = 0.7;

  // Current mode display
  let modeText = "";
  if (!state.isRotating && state.movingX && state.movingY && state.movingZ) {
    modeText = "Edit Mode: Snap to XYZ";
  } else if (state.isRotating) {
    if (state.rotationX) modeText = "Edit Mode: Rotating on X Axis";
    else if (state.rotationY) modeText = "Edit Mode: Rotating on Y Axis";
    else if (state.rotationZ) modeText = "Edit Mode: Rotating on Z Axis";
  } else {
    if (state.movingX) modeText = "Edit Mode: Moving on X Axis";
    else if (state.movingY) modeText = "Edit Mode: Moving on Y Axis";
    else if (state.movingZ) modeText = "Edit Mode: Moving on Z Axis";
  }

  mp.game.graphics.drawText(modeText, [0.01, startY], {
    font: 0,
    color: [0, 255, 0, 255],
    scale: [fontScale, fontScale],
    outline: true
  });

  // Controls help
  mp.game.graphics.drawText("Controls:", [0.01, 0.75], {
    font: 0,
    color: [0, 255, 0, 255],
    scale: [fontScale, fontScale],
    outline: true
  });

  mp.game.graphics.drawText("Right click -> Select object, drag to move or rotate", [0.03, 0.8], {
    font: 0,
    color: [0, 255, 0, 255],
    scale: [fontScale, fontScale],
    outline: true
  });

  mp.game.graphics.drawText("X, Y, Z -> Switch axis in positioning/rotation mode", [0.03, 0.85], {
    font: 0,
    color: [0, 255, 0, 255],
    scale: [fontScale, fontScale],
    outline: true
  });

  mp.game.graphics.drawText("R -> Switch between Rotation & Position mode", [0.03, 0.9], {
    font: 0,
    color: [0, 255, 0, 255],
    scale: [fontScale, fontScale],
    outline: true
  });

  mp.game.graphics.drawText("B -> Snap to XYZ mode | G -> Snap to Ground", [0.03, 0.95], {
    font: 0,
    color: [0, 255, 0, 255],
    scale: [fontScale, fontScale],
    outline: true
  });

  // Alert display
  if (state.alertMessage) {
    mp.game.graphics.drawText(state.alertMessage, [0.4, 0.86], {
      font: 0,
      color: [255, 255, 255, 255],
      scale: [0.5, 0.5],
      outline: true
    });

    // Check if alert has timed out
    const timeSinceAlert = Date.now() - state.alertCreatedTime;
    if (timeSinceAlert > CONFIG.alertDuration) {
      state.alertMessage = null;
    }
  }

  // Draw selection boxes
  if (state.selectedObject && state.selectedObject.handle !== 0) {
    drawSelectionBox(state.selectedObject.position, { r: 0, g: 255, b: 0, a: 250 });
  }
}

// Object manipulation
function updateObjectTransformation(): void {
  if (!state.selectedObject || !mp.gui.cursor.visible) return;

  const cursorPos = { x: mp.gui.cursor.position[0], y: mp.gui.cursor.position[1] };

  // Right mouse button held - dragging
  if (mp.game.controls.isControlPressed(0, 25)) { // Right mouse button
    const clickedWorldPos = getWorldPositionFromScreenPosition(cursorPos);

    if (clickedWorldPos) {
      // Snap to XYZ mode - free positioning
      if (!state.isRotating && state.movingX && state.movingY && state.movingZ) {
        state.selectedObject.position = clickedWorldPos;
      } else {
        // Axis-locked mode
        if (state.isRotating) {
          // Rotation mode
          const offset = CONFIG.rotationOffset;
          const currentRot = state.selectedObject.getRotation(0);

          if (state.rotationX) {
            state.selectedObject.setRotation(currentRot.x + offset, currentRot.y, currentRot.z, 0, false);
          } else if (state.rotationY) {
            state.selectedObject.setRotation(currentRot.x, currentRot.y + offset, currentRot.z, 0, false);
          } else if (state.rotationZ) {
            state.selectedObject.setRotation(currentRot.x, currentRot.y, currentRot.z + offset, 0, false);
          }
        } else {
          // Position mode
          if (state.dragStartWorldPos) {
            const currentPos = state.selectedObject.position;

            if (state.movingX) {
              const distX = clickedWorldPos.x - state.dragStartWorldPos.x;
              state.selectedObject.position = new mp.Vector3(
                currentPos.x + distX,
                currentPos.y,
                currentPos.z
              );
              state.dragStartWorldPos = clickedWorldPos;
            } else if (state.movingY) {
              const distY = clickedWorldPos.y - state.dragStartWorldPos.y;
              state.selectedObject.position = new mp.Vector3(
                currentPos.x,
                currentPos.y + distY,
                currentPos.z
              );
              state.dragStartWorldPos = clickedWorldPos;
            } else if (state.movingZ) {
              // Z-axis uses 2D cursor movement
              if (state.lastCursorPos) {
                const dist2D = state.lastCursorPos.y - cursorPos.y;
                const scaledDist = CONFIG.moveOffsetPerPixel * dist2D;

                let newZ = currentPos.z + scaledDist;

                // Limit to ground
                const groundZ = getGroundPosition(currentPos);
                if (newZ < groundZ) {
                  newZ = groundZ;
                }

                state.selectedObject.position = new mp.Vector3(
                  currentPos.x,
                  currentPos.y,
                  newZ
                );
              }
              state.lastCursorPos = cursorPos;
            }
          }
        }
      }
    }
  }
}

function handleObjectSelection(): void {
  if (!state.isEditMode || !mp.gui.cursor.visible) return;

  // Right mouse button just pressed
  if (mp.game.controls.isControlJustPressed(0, 25)) {
    const raycast = raycastFromCamera();

    if (raycast.hit && raycast.entity) {
      // Check if it's an object
      if (raycast.entity.type === 'object') {
        state.selectedObject = raycast.entity as ObjectMp;
        state.dragStartWorldPos = raycast.position;
        state.lastCursorPos = { x: mp.gui.cursor.position[0], y: mp.gui.cursor.position[1] };

        showAlert("Object selected - drag to move");
      }
    }
  }

  // Right mouse button released - commit changes
  if (mp.game.controls.isControlJustReleased(0, 25)) {
    if (state.selectedObject) {
      const finalPos = state.selectedObject.position;
      const finalRot = state.selectedObject.getRotation(0);

      // Send to server
      mp.events.callRemote(
        'furniture:commitChange',
        state.selectedObjectDBID || 0,
        finalPos.x, finalPos.y, finalPos.z,
        finalRot.x, finalRot.y, finalRot.z
      );

      showAlert("Object position saved");

      // Don't deselect - allow continuous editing
      state.dragStartWorldPos = null;
      state.lastCursorPos = null;
    }
  }
}

// Editor control
export function startEditMode(): void {
  state.isEditMode = true;
  state.movingX = true;
  state.movingY = true;
  state.movingZ = true;
  state.isRotating = false;

  mp.gui.cursor.show(true, true);
  mp.game.ui.displayRadar(false);

  showAlert("Edit mode started");
}

export function stopEditMode(): void {
  state.isEditMode = false;
  state.selectedObject = null;
  state.selectedObjectDBID = null;
  state.dragStartWorldPos = null;
  state.lastCursorPos = null;

  mp.gui.cursor.show(false, false);
  mp.game.ui.displayRadar(true);

  showAlert("Edit mode stopped");
}

export function isInEditMode(): boolean {
  return state.isEditMode;
}

export function isObjectBeingMoved(): boolean {
  return state.selectedObject !== null;
}

// Key bindings
mp.keys.bind(0x42, false, () => { // B key
  if (!state.isEditMode || state.isRotating) return;

  state.movingX = true;
  state.movingY = true;
  state.movingZ = true;
  handleXYZAlert();
});

mp.keys.bind(0x58, false, () => { // X key
  if (!state.isEditMode) return;

  if (state.isRotating) {
    state.rotationX = true;
    state.rotationY = false;
    state.rotationZ = false;
  } else {
    state.movingX = true;
    state.movingY = false;
    state.movingZ = false;
  }
  handleXYZAlert();
});

mp.keys.bind(0x59, false, () => { // Y key
  if (!state.isEditMode) return;

  if (state.isRotating) {
    state.rotationX = false;
    state.rotationY = true;
    state.rotationZ = false;
  } else {
    state.movingX = false;
    state.movingY = true;
    state.movingZ = false;
  }
  handleXYZAlert();
});

mp.keys.bind(0x5A, false, () => { // Z key
  if (!state.isEditMode) return;

  if (state.isRotating) {
    state.rotationX = false;
    state.rotationY = false;
    state.rotationZ = true;
  } else {
    state.movingX = false;
    state.movingY = false;
    state.movingZ = true;
  }
  handleXYZAlert();
});

mp.keys.bind(0x52, false, () => { // R key
  if (!state.isEditMode) return;

  state.isRotating = !state.isRotating;
  showAlert(state.isRotating ? "Switched to 'Rotation' mode" : "Switched to 'Position' mode");
});

mp.keys.bind(0x47, false, () => { // G key - Snap to ground
  if (!state.isEditMode || !state.selectedObject) return;

  const currentPos = state.selectedObject.position;
  const groundZ = getGroundPosition(currentPos);

  state.selectedObject.position = new mp.Vector3(currentPos.x, currentPos.y, groundZ);

  // Also use native place on ground for better results
  state.selectedObject.placeOnGroundProperly();

  showAlert("Object snapped to ground");
});

mp.keys.bind(0x1B, false, () => { // ESC key - Exit edit mode
  if (!state.isEditMode) return;
  stopEditMode();
});

// Render loop
mp.events.add('render', () => {
  if (!state.isEditMode) return;

  // Disable conflicting controls
  mp.game.controls.disableControlAction(0, 24, true); // Attack
  mp.game.controls.disableControlAction(0, 25, true); // Aim
  mp.game.controls.disableControlAction(0, 140, true); // Melee attack light
  mp.game.controls.disableControlAction(0, 141, true); // Melee attack heavy
  mp.game.controls.disableControlAction(0, 142, true); // Melee attack alternate

  // Handle object manipulation
  handleObjectSelection();
  updateObjectTransformation();

  // Draw UI
  drawUI();
});

// Server events
mp.events.add('furniture:startEdit', () => {
  startEditMode();
});

mp.events.add('furniture:stopEdit', () => {
  stopEditMode();
});

// Command for testing
mp.events.add('command:editobject', () => {
  if (state.isEditMode) {
    stopEditMode();
  } else {
    startEditMode();
  }
});
