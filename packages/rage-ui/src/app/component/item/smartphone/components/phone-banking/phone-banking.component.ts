import { Types } from 'mongoose';
import { CommonModule } from '@angular/common';
import { delay, Observable, of, tap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BankAccountType, IBankAccount } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { fadeInOutTrigger } from '../../../../../domain/util/animation.util';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';


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

  data = {
    datasets: [
      {
        data: [11, 3, 14],
        backgroundColor: [
          this.documentStyle.getPropertyValue('--red-500'),
          this.documentStyle.getPropertyValue('--green-500'),
          this.documentStyle.getPropertyValue('--yellow-500')
        ],
        label: 'My dataset'
      }
    ],
    labels: ['Red', 'Green', 'Yellow']
  };

  options = {
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


  constructor(private rageClientService: RageClientService) {
  }

  get isTransferValid() {
    return (this.transferAmount && this.transferAmount > 1) && this.targetBankAccount;
  }

  async copyNumber(number: string) {
    await navigator.clipboard.writeText(number);
  }

  transfer() {

    //
  }

  ngOnInit(): void {
    const bac: Partial<IBankAccount> = {
      phoneNumber: '123456789',
      number: '1234-5678-9123-4567',
      createdAt: new Date(),
      id: 'AA37142F9BE852C184924BC7',
      _id: new Types.ObjectId('AA37142F9BE852C184924BC7'),
      balance: 10065670,
      type: BankAccountType.Main
    };

    this.$bankAccount = of(bac as IBankAccount).pipe(
      delay(1000),
      tap(() => this.isLoading = false)
    );
    // this.$bankAccount = this.rageClientService
    //   .callServer<IBankAccount | null>(ProcedureKey.SERVER_GET_BANK_ACCOUNT_BY_PHONE_NUMBER, this.phoneItem.phoneInfo.phoneNumber);
  }
}
