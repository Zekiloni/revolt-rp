import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '@revolt-rp/common';


@Component({
  selector: 'app-manage-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-catalog.component.html',
  styleUrl: './manage-catalog.component.css'
})
export class ManageCatalogComponent {
  @Input() catalog!: IProduct[];
}
