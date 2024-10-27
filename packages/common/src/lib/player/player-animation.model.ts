import { AnimationFlag } from './animation.enums';

export interface IPlayerAnimation {
   name: string;
   dictionary: string;
   flag: AnimationFlag;
   duration?: number;
}
