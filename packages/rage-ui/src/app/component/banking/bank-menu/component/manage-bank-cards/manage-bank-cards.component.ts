import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBankAccount, IItem, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StyleClassModule } from 'primeng/styleclass';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { playAudio } from '../../../../../domain/util/audio.util';

@Component({
  selector: 'app-manage-bank-cards',
  standalone: true,
  imports: [CommonModule, RadioButtonModule, StyleClassModule, PrimeTemplate, TableModule, TranslatePipe, ButtonDirective, ConfirmPopupModule],
  providers: [ConfirmationService],
  templateUrl: './manage-bank-cards.component.html',
  styleUrl: './manage-bank-cards.component.css'
})
export class ManageBankCardsComponent implements OnInit {
  @Input() bankAccount!: IBankAccount;

  bankCards: IItem[] = [];

  constructor(private rageClientService: RageClientService, private confirmationService: ConfirmationService,
              private translateService: TranslateService,
              private messageService: MessageService) {
  }

  private setCards = (bankCards: IItem[]) => {
    this.bankCards = bankCards;
  };

  ngOnInit(): void {
    this.rageClientService.callServer<IItem[]>(ProcedureKey.SERVER_PLAYER_BANK_GET_CARDS, this.bankAccount.number)
      .subscribe({ next: this.setCards });
  }

  getCardStatusIcon(active: boolean) {
    return active ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500';
  }

  private updateBankCard = (bankCardUpdate: IItem) => {
    this.bankCards = this.bankCards.map(bankCard => bankCard.id === bankCard.id ? bankCardUpdate : bankCard);
  };

  private addBankCard = (item: IItem) => {
    this.bankCards.unshift(item);
  };

  private handleBankError = (error: Error) => {
    playAudio('assets/audio/error-126627.mp3');
    this.messageService.add({
      severity: 'error',
      summary: this.translateService.instant('error'),
      detail: error.message
    });
  };

  createBankCard() {
    this.rageClientService.callServer<IItem>(ProcedureKey.SERVER_PLAYER_BANK_CREATE_CARD, this.bankAccount.id)
      .subscribe({ next: this.addBankCard, error: this.handleBankError });
  }

  deactivateBankCard(event: Event, bankCard: IItem) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translateService.instant('deactivate_bank_card_confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translateService.instant('yes'),
      rejectLabel: this.translateService.instant('no'),
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.rageClientService.callServer<IItem>(ProcedureKey.SERVER_PLAYER_BANK_DEACTIVATE_CARD, bankCard.id)
          .subscribe({ next: this.updateBankCard, error: this.handleBankError });
      }
    });
  }
}
