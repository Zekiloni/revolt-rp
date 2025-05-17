import type { FilterQuery } from 'mongoose';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { ICharacter, IVehicle, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../../domain/service/rage-client.service';
import { buildCitizenNameQuery } from './finder.util';
import { StyleClassModule } from 'primeng/styleclass';


type FinderOption = 'search_citizen' | 'search_vehicle';

@Component({
  selector: 'app-finder',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, FormsModule, TranslatePipe, InputTextModule, StyleClassModule],
  templateUrl: './finder.component.html',
  styleUrl: './finder.component.css'
})
export class FinderComponent implements OnInit, OnDestroy {
  searchOption: FinderOption = 'search_citizen';
  searchOptions: FinderOption[] = ['search_citizen', 'search_vehicle'];
  searchInput: string | null = null;

  response: IVehicle | ICharacter | null = null;

  private destroy$ = new Subject<void>();
  private inputChanged$ = new Subject<string>();

  constructor(private rageClientService: RageClientService) {
  }

  get citizen() {
    return (<ICharacter>this.response);
  }

  get vehicle() {
    return (<IVehicle>this.response);
  }

  get placeholder() {
    return this.searchOption === 'search_citizen' ? 'search_citizen_placeholder' : 'search_vehicle_placeholder';
  }

  get isCitizenSearch() {
    return this.searchOption === 'search_citizen';
  }

  onInputChange(value: string) {
    this.inputChanged$.next(value);
  }

  fetch(filterQuery: string) {
    const procedure = this.isCitizenSearch ?
      ProcedureKey.SERVER_FIND_CHARACTER : ProcedureKey.SERVER_FIND_VEHICLE;

    const query: FilterQuery<IVehicle | ICharacter> = this.isCitizenSearch ?
      buildCitizenNameQuery(filterQuery) : {
        'numberplate.content': {
          $regex: `^${this.searchInput}$`,
          $options: 'i'
        }
      };

    console.log('Fetching data with query:', JSON.stringify(query));
    this.rageClientService.callServer<IVehicle | ICharacter>(procedure, query)
      .subscribe({
        next: (response) => this.response = response,
        error: (error) => {
          console.error('Error fetching data:', JSON.stringify(error));
          this.response = null;
        }
      });
  }

  ngOnInit() {
    this.inputChanged$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(value => {
        this.fetch(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchOptionChange() {
    this.searchInput = null;
    this.response = null;
  }
}
