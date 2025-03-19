import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { CreateAdvertisementComponent } from './components/create-advertisement';

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe, ButtonDirective, CreateAdvertisementComponent],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css',
})
export class AdvertisementComponent {
  products = [];

  creatingAd = false;

  createAd() {

  }
}
