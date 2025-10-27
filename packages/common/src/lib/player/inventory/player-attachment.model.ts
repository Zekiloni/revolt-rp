import { IVector3 } from '../../core.interface';

export interface IPlayerAttachment {
  model: string;
  boneId: number;
  position: IVector3
  rotation: IVector3
  fixedRot: boolean;
  disableControls: number[];
}
