import type { FilterQuery } from 'mongoose';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { EditorModule } from 'primeng/editor';
import { ButtonDirective } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { AdvertisementCategory, IAdvertisement, IAdvertisementCreate, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { CreateAdvertisementComponent } from './components/create-advertisement';
import { SafeHtmlPipe } from '../../../../../domain/util/safe-html.pipe';
import { SingleAdvertisementComponent } from './components/single-advertisement';


type QueryAds = {
  skip: number;
  limit: number;
  filter?: FilterQuery<IAdvertisement>;
}

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe, ButtonDirective, CreateAdvertisementComponent, SafeHtmlPipe, InputTextModule, FormsModule, TagModule, EditorModule, DropdownModule, ReactiveFormsModule, SingleAdvertisementComponent],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css'
})
export class AdvertisementComponent implements OnInit {
  @Input() phoneItem!: IPhoneItem;

  @ViewChild('adsTable') adsTable!: Table;

  readonly categories = Object.values(AdvertisementCategory);

  advertisements: IAdvertisement[] = [];
  totalRecords = 0;

  contentSearch = '';
  selectedCategory: string | null = null;
  contentSearchSubject = new Subject<string>();

  selectedAd!: IAdvertisement | null;

  creatingAd = false;

  constructor(private rageClientService: RageClientService) {
  }

  private handleAdvertisementCreated = (ad: IAdvertisement) => {
    this.creatingAd = false;
    this.selectedAd = ad;
  };

  onAdvertisementCreate(adCreate: IAdvertisementCreate) {
    this.rageClientService.callServer<IAdvertisement>(ProcedureKey.SERVER_CREATE_ADVERTISEMENT, adCreate)
      .subscribe({ next: this.handleAdvertisementCreated });
  }

  lazyLoadAdvertisements(event: TableLazyLoadEvent) {
    const limit = event.rows || 5;
    const skip = (event.first || 0) / (event.rows || 5) * limit;

    const query: QueryAds = {
      skip, limit
    };

    if (this.contentSearch.length > 3) {
      query.filter = {
        content: {
          $regex: this.contentSearch,
          $options: 'i'
        }
      };
    }

    if (this.selectedCategory) {
      query.filter = {
        ...query.filter || {},
        category: this.selectedCategory
      };
    }

    this.rageClientService.callServer<{
      advertisements: IAdvertisement[],
      total: number
    }>(ProcedureKey.SERVER_GET_ADVERTISEMENTS, query)
      .subscribe({
        next: response => {
          this.advertisements = response.advertisements;
          this.totalRecords = response.total;
        }
      });
  }

  private listenToContentSearch() {
    this.contentSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.lazyLoadAdvertisements(this.adsTable.createLazyLoadMetadata());
    });
  }

  onContentSearchChange() {
    this.contentSearchSubject.next(this.contentSearch);
  }

  onSelectedCategoryChange(_event: DropdownChangeEvent) {
    this.lazyLoadAdvertisements(this.adsTable.createLazyLoadMetadata());
  }

  ngOnInit() {
    this.listenToContentSearch();
  }
}
