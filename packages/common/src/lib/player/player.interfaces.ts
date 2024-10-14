import { AnimationFlag } from './animation.enums';

export default interface IPlayerAnimation {
   name: string;
   dictionary: string;
   flag: AnimationFlag;
   duration?: number;
}
