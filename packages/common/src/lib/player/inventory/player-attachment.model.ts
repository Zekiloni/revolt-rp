import { Vector3 } from '../../core.interface';

export interface IPlayerAttachment {
  model: string;
  boneId: number;
  position: Vector3
  rotation: Vector3
  fixedRot: boolean;
  disableControls: number[];
}
