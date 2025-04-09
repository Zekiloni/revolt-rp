import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICharacter, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';


@Component({
  selector: 'app-character-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-overview.component.html',
  styleUrl: './character-overview.component.css'
})
export class CharacterOverviewComponent {
  $character!: Observable<ICharacter>;

  constructor(private rageClientService: RageClientService) {
    this.getCharacter();
  }

  private getCharacter() {
    this.$character = this.rageClientService.callServer<ICharacter>(ProcedureKey.SERVER_GET_PLAYER_CHARACTER);
  }
}
