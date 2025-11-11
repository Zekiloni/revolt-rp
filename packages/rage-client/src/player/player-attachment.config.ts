import { IPlayerAttachment, PlayerAttachmentTypeEnum } from '@revolt-rp/common';

const attackAction = [
  RageEnums.Controls.INPUT_ATTACK,
  RageEnums.Controls.INPUT_ATTACK2,
  RageEnums.Controls.INPUT_AIM,
];

const sprintAndJumpAction = [
  RageEnums.Controls.INPUT_JUMP,
  RageEnums.Controls.INPUT_SPRINT
];

export const playerAttachmentConfig: Record<PlayerAttachmentTypeEnum, IPlayerAttachment<Vector3>> = {
  [PlayerAttachmentTypeEnum.HoldToolPickaxe]: {
    model: 'prop_tool_pickaxe',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: new mp.Vector3(0.09, 0.03, -0.02),
    rotation: new mp.Vector3(-100.0, 150.0, 28.0),
    fixedRot: true,
    disableControls: attackAction
  },
  [PlayerAttachmentTypeEnum.HoldLdFlowBottle]: {
    model: 'prop_ld_flow_bottle',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: new mp.Vector3(0.125, 0.03, -0.02),
    rotation: new mp.Vector3(-100.0, 150.0, 28.0),
    fixedRot: true,
    disableControls: attackAction
  },
  [PlayerAttachmentTypeEnum.HoldAmbBeerBottle]: {
    model: 'prop_amb_beer_bottle',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: new mp.Vector3(0.125, 0.03, -0.02),
    rotation: new mp.Vector3(-100.0, 150.0, 28.0),
    fixedRot: true,
    disableControls: attackAction
  },
  [PlayerAttachmentTypeEnum.HoldAmbPhone]: {
    model: 'prop_amb_phone',
    boneId: RageEnums.Ped.Bones.PH_R_HAND,
    position: new mp.Vector3(0.0, 0.0, 0.0),
    rotation: new mp.Vector3(0.0, 0.0, 0.0),
    fixedRot: true,
    disableControls: attackAction
  },
  [PlayerAttachmentTypeEnum.HoldFishingRod01]: {
    model: 'prop_fishing_rod_01',
    boneId: RageEnums.Ped.Bones.PH_R_HAND,
    position: new mp.Vector3(0.0, 0.0, 0.0),
    rotation: new mp.Vector3(0.0, 0.0, -45.0),
    fixedRot: true,
    disableControls: attackAction
  },
  [PlayerAttachmentTypeEnum.HoldBankCard]: {
    model: 'prop_cs_credit_card',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: new mp.Vector3(0.125, 0.03, -0.02),
    rotation: new mp.Vector3(-100.0, 150.0, 28.0),
    fixedRot: true,
    disableControls: attackAction
  },
  [PlayerAttachmentTypeEnum.HoldBinBag]: {
    model: 'prop_cs_street_binbag_01',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: new mp.Vector3(0.4, 0.0, 0.0),
    rotation: new mp.Vector3(0.0, 270.0, 60.0),
    fixedRot: true,
    disableControls: [...attackAction, ...sprintAndJumpAction]
  },
  [PlayerAttachmentTypeEnum.HoldCuffs]: {
    model: 'p_cs_cuffs_02_s',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: new mp.Vector3(0.0, 0.0, 0.0),
    rotation: new mp.Vector3(0.0, 0.0, 0.0),
    fixedRot: true,
    disableControls: [...attackAction]
  },
  [PlayerAttachmentTypeEnum.Cuffed]: {
    model: 'p_cs_cuffs_02_s',
    boneId: RageEnums.Ped.Bones.SKEL_R_HAND,
    position: new mp.Vector3(-0.02, 0.06, 0.0),
    rotation: new mp.Vector3(75.0, 0.0, 76.0),
    fixedRot: true,
    disableControls: [...attackAction, ...sprintAndJumpAction]
  }
};
