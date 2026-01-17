import { HexKeyCodes, ProcedureKey, PropertyPointType, PropertySharedDataType } from '@revolt-rp/common';
import { registerKeyBind, unregisterKeyBind } from '../core/keybind-manager';
import { triggerServer } from '@libertymp/rage-rpc';

let activeInteractionPointId: string | null = null;

function togglePropertyPointInteraction() {
  if (!activeInteractionPointId) return;
  triggerServer(ProcedureKey.SERVER_PROPERTY_POINT_INTERACTION, activeInteractionPointId);
}

function playerEnterPropertyPoint(colshape: ColshapeMp) {
  const interactionPointId =
    colshape.getVariable<string>(PropertySharedDataType.InteractionPointId);

  const interactionType =
    colshape.getVariable<PropertyPointType>(PropertySharedDataType.InteractionType);

  if (!interactionPointId || interactionType == PropertyPointType.MainPoint) {
    return;
  }

  activeInteractionPointId = interactionPointId;

  registerKeyBind(HexKeyCodes.E, true, togglePropertyPointInteraction, 0);
}

function playerExitPropertyPoint(colshape: ColshapeMp) {
  const interactionPointId =
    colshape.getVariable<string>(PropertySharedDataType.InteractionPointId);

  const interactionType =
    colshape.getVariable<PropertyPointType>(PropertySharedDataType.InteractionType);

  if (
    interactionType == PropertyPointType.MainPoint ||
    interactionPointId !== activeInteractionPointId
  ) {
    return;
  }

  activeInteractionPointId = null;

  unregisterKeyBind(HexKeyCodes.E, togglePropertyPointInteraction);
}

mp.events.add({
  playerEnterColshape: playerEnterPropertyPoint,
  playerExitColshape: playerExitPropertyPoint
});
