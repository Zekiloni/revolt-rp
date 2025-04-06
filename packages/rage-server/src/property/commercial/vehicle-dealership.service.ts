import { t } from 'i18next';
import { triggerClient } from '@libertymp/rage-rpc';
import { ProcedureKey, PropertyPointType } from '@revolt-rp/common';
import { notifyPlayer } from '../../player/util/player-notify.util';
import { Property } from '../property.model';


const getVehiclePreviewPoint = (property: Property) => {
  return property.points.find((point) => point.type === PropertyPointType.PreviewPoint);
};

export const toggleVehicleDealershipMenu = (player: PlayerMp, property: Property) => {
  console.log('property', property);
  const point = getVehiclePreviewPoint(property);

  console.log('point', point);
  if (!point) {
    return notifyPlayer(player, { severity: 'error', summary: t('vehicle_dealership.no_preview_point') });
  }

  const position = new mp.Vector3(point.position.x, point.position.y, point.position.z);
  const rotation = new mp.Vector3(point.rotation.x, point.rotation.y, point.rotation.z);
  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_DEALERSHIP_MENU, { property, position, rotation });
};
