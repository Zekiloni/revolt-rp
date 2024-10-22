import './node';
import { Account } from '../player/account/account.model';
import { Character } from '../player/character/character.model';

declare global {

  interface PlayerMp {
    account: Account;
    character: Character;
  }
}
