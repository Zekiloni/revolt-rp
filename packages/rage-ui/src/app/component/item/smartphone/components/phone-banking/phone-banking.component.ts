import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IBankAccount, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';


@Component({
  selector: 'app-phone-banking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phone-banking.component.html',
  styleUrl: './phone-banking.component.css'
})
export class PhoneBankingComponent implements OnInit {
  @Input() phoneItem!: IPhoneItem;

  $bankAccount: Observable<IBankAccount | null> = of(null);

  constructor(private rageClientService: RageClientService) {
  }

  ngOnInit(): void {
    this.$bankAccount = this.rageClientService
      .callServer<IBankAccount | null>(ProcedureKey.SERVER_GET_BANK_ACCOUNT_BY_PHONE_NUMBER, this.phoneItem.phoneInfo.phoneNumber);
  }
}
