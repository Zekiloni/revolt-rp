import { on, triggerBrowser } from '@libertymp/rage-rpc';
import { GameUiKey, IProperty, ProcedureKey } from '@revolt-rp/common';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';
import { getIsVehiclePreviewCameraActive, toggleVehiclePreviewCamera } from '../vehicle/vehicle-preview.util';


type VehiclePreviewPoint = {
  position: Vector3,
  rotation: Vector3
}

let vehicle: VehicleMp | null = null;
let vehiclePreviewPoint: VehiclePreviewPoint | null = null;

function toggleDealershipMenu(data: { property: IProperty, rotation: Vector3, position: Vector3 } | null) {
  if (data) {
    const { property, position, rotation } = data;

    vehiclePreviewPoint = {
      position, rotation
    };

    showGameInterface(GameUiKey.VehicleDealership);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_PROPERTY, property), 150);
  } else {
    hideGameInterface(GameUiKey.VehicleDealership);

    if (vehicle && mp.vehicles.exists(vehicle)) {
      vehicle.destroy();
      vehicle = null;
    }

    vehiclePreviewPoint = null;
    toggleVehiclePreviewCamera(false);
  }
}


async function previewVehicleModel(model: string) {
  const modelHash = mp.game.joaat(model);

  if (!mp.game.streaming.isModelAVehicle(modelHash))
    return;

  if (!vehicle || !mp.vehicles.exists(vehicle)) {
    vehicle = mp.vehicles.new(modelHash, vehiclePreviewPoint.position, {
      alpha: 0,
      dimension: mp.players.local.dimension,
      locked: true,
      engine: false,
      heading: vehiclePreviewPoint.rotation.z
    });

    vehicle.setRotation(vehiclePreviewPoint.rotation.x, vehiclePreviewPoint.rotation.y, vehiclePreviewPoint.rotation.z, RotationOrder.XYZ, false);
  } else {
    vehicle.model = modelHash;
  }

  while (vehicle.handle === 0) {
    await mp.game.waitAsync(50);
  }

  vehicle.setOnGroundProperly();

  if (!getIsVehiclePreviewCameraActive())
    toggleVehiclePreviewCamera(true, vehicle);
}

on(ProcedureKey.CLIENT_TOGGLE_DEALERSHIP_MENU, toggleDealershipMenu);
on(ProcedureKey.CLIENT_PREVIEW_VEHICLE_MODEL, previewVehicleModel);
