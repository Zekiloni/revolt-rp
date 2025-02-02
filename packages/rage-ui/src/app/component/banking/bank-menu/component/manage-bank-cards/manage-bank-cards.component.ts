import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBankAccount, IItem, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StyleClassModule } from 'primeng/styleclass';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-bank-cards',
  standalone: true,
  imports: [CommonModule, RadioButtonModule, StyleClassModule, PrimeTemplate, TableModule, TranslatePipe],
  templateUrl: './manage-bank-cards.component.html',
  styleUrl: './manage-bank-cards.component.css'
})
export class ManageBankCardsComponent implements OnInit {
  @Input() bankAccount!: IBankAccount;

  bankCards: IItem[] = [];

  constructor(private rageClientService: RageClientService) {
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
}
