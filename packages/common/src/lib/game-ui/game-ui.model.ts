import { GameUiKey } from './game-ui-key.enum';

export type ActiveGameInterface = IGameInterface & { key: GameUiKey };

export interface IGameInterface {
  isActive: boolean;
  mouse?: true;
  disableChat?: true;
  hideChat?: true;
  freezeControls?: true;
  closeOnEscape?: true;
  headless?: true;
  resolution?: { width: number; height: number; };
}
