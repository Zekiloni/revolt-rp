import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref } from '@typegoose/typegoose';
import { IVector3 } from '../core.interface';

export interface IDoor extends Base {
  hash: number;
  position: IVector3;
  dimension: number;
  locked: boolean;
  parent: Ref<IDoor>;
}

export const isDoorPopulated = (door: Ref<IDoor>): door is IDoor => {
  return door !== null && typeof door === 'object' && 'position' in door;
};
