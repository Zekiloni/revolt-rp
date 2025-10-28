import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccount } from '@revolt-rp/common';
import { AuthService } from '../../../core/service/auth.service';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe
  ],
  providers: [AuthService],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  $account: Observable<IAccount>;

  constructor(private authService: AuthService) {
    this.$account = this.authService.getUserInfo();
  }
}
