import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref } from '@typegoose/typegoose';
import { ICharacter } from '../character/character.model';


export interface IPlayerDeath extends Base{
  target: Ref<ICharacter>;
  killer?: Ref<ICharacter>;
  giveUp: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
