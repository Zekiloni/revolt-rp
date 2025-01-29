import { IPlayerAttachment, PlayerAttachmentTypeEnum } from '@revolt-rp/common';

const attackAction = [
  RageEnums.Controls.INPUT_ATTACK,
  RageEnums.Controls.INPUT_ATTACK2,
];

export const playerAttachmentConfig: Record<PlayerAttachmentTypeEnum, IPlayerAttachment> = {
  [PlayerAttachmentTypeEnum.HoldToolPickaxe]: {
    model: 'prop_tool_pickaxe',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: { x: 0.09, y: 0.03, z: -0.02 },
    rotation: { x: -100.0, y: 150.0, z: 28.0 },
    fixedRot: true,
    disableControls: attackAction,
  },
  [PlayerAttachmentTypeEnum.HoldLdFlowBottle]: {
    model: 'prop_ld_flow_bottle',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: { x: 0.125, y: 0.03, z: -0.02 },
    rotation: { x: -100.0, y: 150.0, z: 28.0 },
    fixedRot: true,
    disableControls: attackAction,
  },
  [PlayerAttachmentTypeEnum.HoldAmbBeerBottle]: {
    model: 'prop_amb_beer_bottle',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: { x: 0.125, y: 0.03, z: -0.02 },
    rotation: { x: -100.0, y: 150.0, z: 28.0 },
    fixedRot: true,
    disableControls: attackAction,
  },
  [PlayerAttachmentTypeEnum.HoldAmbPhone]: {
    model: 'prop_amb_phone',
    boneId: RageEnums.Ped.Bones.PH_R_HAND,
    position: { x: 0.0, y: 0.0, z: 0.0 },
    rotation: { x: 0.0, y: 0.0, z: 0.0 },
    fixedRot: true,
    disableControls: attackAction
  },
  [PlayerAttachmentTypeEnum.HoldFishingRod01]: {
    model: 'prop_fishing_rod_01',
    boneId: RageEnums.Ped.Bones.PH_R_HAND,
    position: { x: 0.0, y: 0.0, z: 0.0 },
    rotation: { x: 0.0, y: 0.0, z: -45.0 },
    fixedRot: true,
    disableControls: attackAction
  }
}
