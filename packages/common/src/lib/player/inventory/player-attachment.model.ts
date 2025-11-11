import { IVector3 } from '../../core.interface';

export interface IPlayerAttachment<T = IVector3> {
  model: string;
  boneId: number;
  position: T
  rotation: T
  fixedRot: boolean;
  disableControls: number[];
}
