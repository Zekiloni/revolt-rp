import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { filter, map, Observable } from 'rxjs';
import { IAuthorizationState } from '../../../core/store/auth/auth.state';
import { selectAccount } from '../../../core/store/auth/auth.selector';
import { SidebarComponent } from '../../../components/ucp/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    AsyncPipe,
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  $accountId!: Observable<string>;

  constructor(@Inject(Store) private store: Store<IAuthorizationState>) {
    this.getAccountId();
  }

  private getAccountId() {
    this.$accountId = this.store.select(selectAccount).pipe(
      filter((account): account is NonNullable<typeof account> => !!account),
      map(account => account.id)
    );
  }
}

