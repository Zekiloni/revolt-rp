import { AnimationFlag } from './animation.enum';

export interface IPlayerAnimation {
   name: string;
   dictionary: string;
   flag: AnimationFlag;
   duration?: number;
}
