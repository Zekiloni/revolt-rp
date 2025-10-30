import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { IAccount, ICharacter } from '@revolt-rp/common';


@Injectable({ providedIn: 'root' })
export class CharacterService extends BaseApiService {

  getCharacter(character: string) {
    return this.httpClient.get<ICharacter>(`${this.getApiPath('character')}/${character}`);
  }
}
