import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBankAccount, ITransaction, ProcedureKey, TransactionStatus, TransactionType } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent implements OnInit {
  @Input() bankAccount!: IBankAccount;

  transactions: ITransaction[] = [];

  constructor(private rageClientService: RageClientService) {
  }

  setTransactions = (transactions: ITransaction[]) => {
    this.transactions = transactions;
  };

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions() {
    this.rageClientService.callServer<ITransaction[]>(ProcedureKey.SERVER_PLAYER_BANK_GET_TRANSACTIONS, this.bankAccount.id)
      .subscribe({ next: this.setTransactions });
  }

  protected readonly TransactionStatus = TransactionStatus;

  getTransactionStatusIcon(transaction: ITransaction) {
    return transaction.status === TransactionStatus.Completed ? 'pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500';
  }

  getTransactionTypeIcon(transaction: ITransaction) {
    switch (transaction.type) {
      case TransactionType.Deposit:
        return 'pi-plus-circle text-green-500';
      case TransactionType.Withdraw:
        return 'pi-minus-circle text-red-500';
      case TransactionType.Transfer:
        return 'pi-exchange text-blue-500';

      default:
        return 'pi-question-circle text-gray-500';
    }
  }
}
