import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RageClientService } from '../../../../../../domain/service/rage-client.service';
import { Observable, of } from 'rxjs';
import { IGangRecord, ProcedureKey } from '@revolt-rp/common';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-gang-record',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe, ButtonDirective],
  templateUrl: './gang-record.component.html',
  styleUrl: './gang-record.component.css'
})
export class GangRecordComponent {
  $gangRecords!: Observable<IGangRecord[]>;
  newRecordVisible = false;

  form!: FormGroup;

  constructor(private rageClientService: RageClientService, private formBuilder: FormBuilder) {
    this.buildForm();
    this.getGangRecords();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required]],
      note: [null]
    });
  }

  private getGangRecords() {
    this.$gangRecords = of([]);
  }

  private handleCreateResponse = () => {
    this.newRecordVisible = false;
    this.form.reset();
  };

  create() {
    if (this.form.invalid)
      return;

    this.rageClientService.callServer<IGangRecord>(ProcedureKey.SERVER_CREATE_GANG_RECORD, this.form.getRawValue())
      .subscribe({ next: this.handleCreateResponse });
  }
}
