import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { GameUiKey, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../domain/service/rage-client.service';
import { DrivingQuizComponent } from './components/driving-quiz';


@Component({
  selector: 'app-dmv-menu',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  providers: [DialogService],
  templateUrl: './dmv-menu.component.html',
  styleUrl: './dmv-menu.component.css'
})
export class DmvMenuComponent {

  constructor(
    private rageClientService: RageClientService,
    private dialogService: DialogService,
    private translateService: TranslateService) {
  }

  takeDrivingQuiz() {
    this.dialogService.open(DrivingQuizComponent, {
      header: this.translateService.instant('dmv_menu.driving_quiz'),
      width: '40%',
      focusOnShow: false
    });
  }

  close() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_HIDE_INTERFACE, GameUiKey.DmvMenu);
  }
}
