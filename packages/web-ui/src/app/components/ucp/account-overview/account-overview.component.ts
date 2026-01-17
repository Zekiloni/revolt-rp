import { Component, Inject } from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';
import { IAccount, ICharacter } from '@revolt-rp/common';
import { AccountService } from '../../../core/service/account.service';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { selectAccount } from '../../../core/store/auth/auth.selector';
import { Store } from '@ngrx/store';
import { IAuthorizationState } from '../../../core/store/auth/auth.state';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { ModerationLogComponent } from '../moderation-log';
import { DialogService } from 'primeng/dynamicdialog';
import { ChangePasswordComponent } from '../change-password';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    ButtonDirective,
    DatePipe,
    ModerationLogComponent
  ],
  providers: [DialogService, AccountService],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.css'
})
export class AccountOverviewComponent {
  $accountId!: Observable<string>;
  $account!: Observable<IAccount>;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    @Inject(Store) private store: Store<IAuthorizationState>,
    private accountService: AccountService) {
    this.getAccount();
  }

  getAccount() {
    this.$accountId = this.store.select(selectAccount).pipe(
      filter((account): account is NonNullable<typeof account> => !!account),
      map(account => account.id),
      tap(accountId => this.$account = this.accountService.getAccount(accountId))
    );
  }

  getCharacters(account: IAccount) {
    return account.characters as ICharacter[];
  }

  async openCharacter(id: string) {
    await this.router.navigate(['/dashboard', 'character', id]);
  }

  getApprovedBadgeClasses() {
    return undefined;
  }

  isDiscordLinked(account: IAccount) {
    return !!account.discordId;
  }

  getTotalHours(account: IAccount) {
    const characters = this.getCharacters(account);
    return characters.reduce((total, character) => total + (character.hours || 0), 0);
  }

  changePassword() {
    this.dialogService.open(ChangePasswordComponent, {
      header: 'Change Password',
      width: '20%',
      modal: true,
      dismissableMask: true,
      closable: true
    });
  }
}
