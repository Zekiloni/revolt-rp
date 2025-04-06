import { HexKeyCodes } from '@revolt-rp/common';

let [cursorPreviousX, cursorPreviousY] = mp.gui.cursor.position;
const [minFov, maxFov] = [10, 100];

let vehicleFov = 60;
let currentVehicleFov = 0;
let vehicleCamera: CameraMp;
let vehicleHandleControlsInterval: ReturnType<typeof setInterval>;
let vehicleHeading = 0;

let isVehiclePreviewCameraActive = false;
let previewVehicle: VehicleMp | null = null;
let modelSize: { x: number, y: number, z: number } | null =null


async function handleVehiclePreviewCameraControls(vehicle: VehicleMp) {
  if (!isVehiclePreviewCameraActive || !previewVehicle) return;

  if (vehicleCamera && mp.cameras.exists(vehicleCamera)) {
    const x = cursorPreviousX, y = cursorPreviousY;
    cursorPreviousX = mp.gui.cursor.position[0];
    cursorPreviousY = mp.gui.cursor.position[1];

    const [deltaX, deltaY] = [mp.gui.cursor.position[0] - x, mp.gui.cursor.position[1] - y];

    if (!mp.keys.isDown(HexKeyCodes.RightMouse)) return;

    // Zoom controls (scroll up / scroll down)
    if (mp.game.controls.isDisabledControlPressed(RageEnums.InputGroup.INPUTGROUP_MOVE, RageEnums.Controls.INPUT_WEAPON_WHEEL_PREV)) {
      currentVehicleFov = Math.max(minFov, currentVehicleFov - 2);
    } else if (mp.game.controls.isDisabledControlPressed(RageEnums.InputGroup.INPUTGROUP_MOVE, RageEnums.Controls.INPUT_WEAPON_WHEEL_NEXT)) {
      currentVehicleFov = Math.min(maxFov, currentVehicleFov + 2);
    }

    vehicleCamera.setFov(currentVehicleFov);

    const { x: positionX, y: positionY, z: positionZ } = vehicle.getCoords(false);
    let { z: camPosZ } = vehicleCamera.getCoord();

    vehicleHeading += deltaX * 0.15;

    const offsetX = positionX + Math.cos(((vehicleHeading + 90) * Math.PI) / 180) * (Math.max(modelSize.x, modelSize.y, modelSize.z) + 2);
    const offsetY = positionY + Math.sin(((vehicleHeading + 90) * Math.PI) / 180) * (Math.max(modelSize.x, modelSize.y, modelSize.z) + 2);

    camPosZ += deltaY * 0.001;

    if (camPosZ < positionZ + 5 && camPosZ > positionZ - 5) {
      vehicleCamera.setCoord(offsetX, offsetY, camPosZ);
      vehicleCamera.pointAtCoord(positionX, positionY, camPosZ);
    }
  }
}
export function toggleVehiclePreviewCamera(toggle: boolean, vehicle: VehicleMp | null = null) {
  isVehiclePreviewCameraActive = toggle;

  if (toggle && vehicle) {
    previewVehicle = vehicle;

    // Get model dimensions for the vehicle
    const { minimum, maximum } = mp.game.gameplay.getModelDimensions(vehicle.model);

    modelSize = {
      x: maximum.x - minimum.x,
      y: maximum.y - minimum.y,
      z: maximum.x - minimum.z
    };

    // Calculate an appropriate FOV based on the model size
    vehicleFov = Math.min(Math.max(modelSize.x, modelSize.y, modelSize.z) / 0.15 * 10, 60);
    currentVehicleFov = vehicleFov;

    vehicleHeading = vehicle.getHeading();

    const { x, y, z } = vehicle.getCoords(false);

    const center = {
      x: x + (minimum.x + maximum.x) / 2,
      y: y + (minimum.y + maximum.y) / 2,
      z: z + (minimum.z + maximum.z) / 2
    };

    const camPos = {
      x: center.x + (Math.max(modelSize.x, modelSize.y, modelSize.z) + 2) * Math.cos(340),
      y: center.y + (Math.max(modelSize.x, modelSize.y, modelSize.z) + 2) * Math.sin(340),
      z: center.z + modelSize.z / 2
    };

    vehicleCamera = mp.cameras.new('default', new mp.Vector3(camPos.x, camPos.y, camPos.z), new mp.Vector3(0, 0, 0), currentVehicleFov);
    vehicleCamera.setCoord(camPos.x, camPos.y, camPos.z);
    vehicleCamera.pointAtCoord(center.x, center.y, center.z);
    vehicleCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

    vehicleHandleControlsInterval = setInterval(() => handleVehiclePreviewCameraControls(vehicle), 0);
  } else {
    if (vehicleCamera && mp.cameras.exists(vehicleCamera)) {
      vehicleCamera.destroy();
      mp.game.cam.renderScriptCams(false, false, 0, false, false, 0);
    }

    clearInterval(vehicleHandleControlsInterval);
  }
}

export const getIsVehiclePreviewCameraActive = () => isVehiclePreviewCameraActive;
