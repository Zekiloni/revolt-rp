import dayjs from 'dayjs';
import { ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { catchError, delay, Observable, of, tap } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { IBankAccount, IBankInteraction, ITransaction, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { fadeInOutTrigger } from '../../../../../domain/util/animation.util';
import { getBankMonthlyStats } from '../../../../../domain/util/phone.util';


@Component({
  selector: 'app-phone-banking',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, TranslatePipe, InputTextModule, ButtonDirective, ChartModule, TooltipModule, InputNumberModule, FormsModule, InputMaskModule],
  templateUrl: './phone-banking.component.html',
  styleUrl: './phone-banking.component.css',
  animations: [fadeInOutTrigger]
})
export class PhoneBankingComponent implements OnInit {
  @Input() phoneItem!: IPhoneItem;

  isLoading = true;
  transferMoneyAction = false;
  transferAmount = null;
  targetBankAccount: string | null = null;

  $bankAccount: Observable<IBankAccount | null> = of(null);

  documentStyle = getComputedStyle(document.documentElement);
  surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

  chartData: ChartData | null = null;
  chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      r: {
        grid: {
          color: this.surfaceBorder
        }
      }
    }
  };

  constructor(private rageClientService: RageClientService, private translateService: TranslateService) {
  }

  get isTransferValid() {
    return (this.transferAmount && this.transferAmount > 1) && this.targetBankAccount;
  }

  async copyNumber(number: string) {
    await navigator.clipboard.writeText(number);
  }

  private getBankAccount() {
    this.$bankAccount = this.rageClientService
      .callServer<IBankAccount>(ProcedureKey.SERVER_GET_BANK_ACCOUNT_BY_PHONE_NUMBER, this.phoneItem.phoneInfo.phoneNumber)
      .pipe(
        delay(500),
        tap((bankAccount) => {
          this.getBankStats(bankAccount.id);
          this.isLoading = false;
        }),
        catchError(() => {
          this.isLoading = false;
          return of(null);
        })
      );
  }

  private getBankStats(bankAccountId: string) {
    this.rageClientService.callServer<ITransaction[]>(ProcedureKey.SERVER_BANK_GET_TRANSACTIONS, {
      bankAccountId,
      filter: {
        createdAt: {
          $gte: dayjs().startOf('month').toDate()
        }
      }
    }).subscribe((transactions => {
      this.buildChartData(getBankMonthlyStats(transactions));
    }));
  }

  private buildChartData(data: [number, number]) {
    this.chartData = {
      datasets: [
        {
          data,
          backgroundColor: [
            this.documentStyle.getPropertyValue('--green-500'),
            this.documentStyle.getPropertyValue('--red-500')
          ]
        }
      ],
      labels: [this.translateService.instant('income'), this.translateService.instant('outcome')]
    };
  }

  private refreshTransferAction() {
    this.transferMoneyAction = false;
    this.transferAmount = null;
    this.targetBankAccount = null;
  }

  transfer(bankAccountId: string) {
    if (this.transferAmount) {
      const bankInteraction: IBankInteraction = {
        bankAccountId,
        type: 'online',
        targetAccountNumber: this.targetBankAccount,
        amount: this.transferAmount
      };

      this.rageClientService.callServer(ProcedureKey.SERVER_PLAYER_TRANSFER_MONEY, bankInteraction)
        .subscribe(() =>  {
          this.refreshTransferAction();
          this.getBankAccount();
          // todo: handle errors (invalid amount, target bank account no doesnt exist, etc.
        });
    }
  }

  ngOnInit(): void {
    this.getBankAccount();
  }
}
