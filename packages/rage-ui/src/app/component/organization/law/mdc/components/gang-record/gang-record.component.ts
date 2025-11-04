import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Button, ButtonDirective } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { deepCopy, IGangRecord, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../../domain/service/rage-client.service';
import { filterGlobal } from '../../../../../../domain/util/table.util';
import { TruncatePipe } from '../../../../../../../../../common-ui/src/lib/pipe/truncate.pipe';


@Component({
  selector: 'app-gang-record',
  standalone: true,
  imports: [CommonModule, TableModule, TranslatePipe, ButtonDirective, DialogModule, ReactiveFormsModule, InputTextModule, IconFieldModule, InputIconModule, Button, TooltipModule, FormsModule, TruncatePipe],
  templateUrl: './gang-record.component.html',
  styleUrl: './gang-record.component.scss'
})
export class GangRecordComponent {
  protected readonly filterGlobal = filterGlobal;

  gangRecords: IGangRecord[] = [];
  newRecordVisible = false;
  gangRecordClones: Record<string, IGangRecord> = {};

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
    this.rageClientService.callServer<IGangRecord[]>(ProcedureKey.SERVER_GET_GANG_RECORDS)
      .subscribe({ next: records => this.gangRecords = records });
  }

  private handleCreateResponse = () => {
    this.newRecordVisible = false;
    this.form.reset();
    this.getGangRecords();
  };

  create() {
    if (this.form.invalid)
      return;

    this.rageClientService.callServer<IGangRecord>(ProcedureKey.SERVER_CREATE_GANG_RECORD, this.form.getRawValue())
      .subscribe({ next: this.handleCreateResponse });
  }

  delete(record: IGangRecord) {
    this.rageClientService.callServer(ProcedureKey.SERVER_DELETE_GANG_RECORD, record.id)
      .subscribe({ next: () => this.getGangRecords() });
  }

  editInit(record: IGangRecord) {
    this.gangRecordClones[record.id] = deepCopy(record);
  }

  editCancel(point: IGangRecord, index: number) {
    this.gangRecords[index] = this.gangRecordClones[point.id];
    delete this.gangRecordClones[point.id];
  }

  editSave(point: IGangRecord, index: number) {
    const update = point;
    this.editCancel(point, index);
    this.rageClientService.callServer<IGangRecord>(ProcedureKey.SERVER_UPDATE_GANG_RECORD, update)
      .subscribe({ next: updated => this.gangRecords[index] = updated });
  }
}
