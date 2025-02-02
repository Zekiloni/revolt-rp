import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputOtpModule } from 'primeng/inputotp';
import { IBankAccount, IBankCardInfo, IItem, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { fadeInOutTrigger } from '../../../domain/util/animation.util';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-bank-atm',
  standalone: true,
  imports: [CommonModule, InputOtpModule, FormsModule, Button, TranslatePipe, InputMaskModule, ButtonDirective],
  templateUrl: './bank-atm.component.html',
  styleUrl: './bank-atm.component.css',
  animations: [fadeInOutTrigger]
})
export class BankAtmComponent implements OnInit, OnDestroy {
  bankAccount: Partial<IBankAccount> | null = {
    'number': '1431-2326-9706-4775',
    'balance': 17500,
    'id': '679ebdf0f02e3845768aa325'
  };
  bankCardInfo: IBankCardInfo | null = null;
  pinCodeInput: string | null = null;
  pinInvalid = false;

  constructor(private rageClientService: RageClientService) {
  }

  get isValidPin() {
    return this.pinCodeInput && this.pinCodeInput.length === 4;
  }

  private initializeAtm = (item: IItem) => {
    if (item && item.bankCardInfo) {
      this.bankCardInfo = item.bankCardInfo;
    }
  };

  ngOnDestroy(): void {
    this.rageClientService.off(ProcedureKey.BROWSER_ATM_INIT, this.initializeAtm);
  }

  ngOnInit(): void {
    this.rageClientService.on(ProcedureKey.BROWSER_ATM_INIT, this.initializeAtm);
  }

  submitAuthentication() {
    if (this.bankCardInfo && this.isValidPin && this.bankCardInfo.pinCode === this.pinCodeInput) {
      this.rageClientService.callServer<IBankAccount>(ProcedureKey.SERVER_PLAYER_BANK_GET_ACCOUNT, this.bankCardInfo.bankAccountNo)
        .subscribe({
          next: (bankAccount) => this.bankAccount = bankAccount
        });
    } else {
      this.pinInvalid = true;
    }
  }

  closeAtm() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_PLAYER_CLOSE_ATM);
  }
}
