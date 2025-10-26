import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { IItem, IPayment, PaymentType, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../domain/service/rage-client.service';
import { dayjs } from '../../../domain/util/dajys.util';

@Component({
  selector: 'app-select-payment-method',
  standalone: true,
  imports: [CommonModule, RadioButtonModule, FormsModule, TranslatePipe],
  templateUrl: './select-payment-method.component.html',
  styleUrl: './select-payment-method.component.css'
})
export class SelectPaymentMethodComponent implements OnInit {
  @Output() paymentChange = new EventEmitter<IPayment>();
  payment: IPayment;

  $bankCards!: Observable<IItem[]>;

  paymentTypeCash: IPayment = {
    type: PaymentType.Cash
  };

  constructor(private rageClientService: RageClientService) {
    this.payment = this.paymentTypeCash;
  }

  onSelectPayment(payment: IPayment) {
    this.payment = payment;
    this.paymentChange.emit(payment);
  }

  isCardActive(item: IItem) {
    return item.bankCardInfo?.active && dayjs().isBefore(dayjs(item?.expiringAt));
  }

  getBankCardPayment(item: IItem) {
    return {
      type: PaymentType.BankCard,
      bankAccountNo: item.bankCardInfo?.bankAccountNo
    };
  }

  ngOnInit() {
    this.$bankCards = this.rageClientService.callServer<IItem[]>(ProcedureKey.SERVER_PLAYER_INVENTORY_GET_BANK_CARDS);
  }
}
