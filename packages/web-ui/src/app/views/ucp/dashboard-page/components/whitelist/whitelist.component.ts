import { Component, Inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAuthorizationState } from '../../../../../core/store/auth/auth.state';
import { Subject, takeUntil } from 'rxjs';
import { IWhitelist, WhitelistStatus } from '@revolt-rp/common';
import { selectAccount } from '../../../../../core/store/auth/auth.selector';
import { WhitelistService } from '../../../../../core/service/whitelist.service';
import { AsyncPipe, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateWhitelistApplicationComponent } from '../../../../../components/ucp/create-whitelist-application';

@Component({
  selector: 'app-whitelist',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    TitleCasePipe,
    NgClass,
    Button
  ],
  providers: [DialogService, WhitelistService],
  templateUrl: './whitelist.component.html',
  styleUrl: './whitelist.component.css'
})
export class WhitelistComponent implements OnDestroy {
  protected readonly WhitelistStatus = WhitelistStatus;

  private destroy$ = new Subject<void>();

  whitelists: IWhitelist[] = [];

  constructor(
    private dialogService: DialogService,
    @Inject(Store) private store: Store<IAuthorizationState>,
    private whitelistService: WhitelistService
  ) {
    this.getWhitelists();
  }

  private getWhitelists() {
    this.store.select(selectAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        if (account) {
          this.whitelistService.getWhitelistsByAccountId(account.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (whitelists) => this.whitelists = whitelists
            });
        }
      });
  }

  addNewWhitelist() {
    this.dialogService.open(CreateWhitelistApplicationComponent, {
      header: 'New Whitelist Application',
      width: '50%',
      focusOnShow: false,
      modal: true,
      closable: false,
      closeOnEscape: false,
      dismissableMask: false
    }).onClose.subscribe((result: boolean) => {
      if (result) {
        this.getWhitelists();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
