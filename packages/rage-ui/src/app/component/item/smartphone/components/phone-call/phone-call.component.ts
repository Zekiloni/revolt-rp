import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { interval, map, Observable, startWith } from 'rxjs';
import { IPhoneCall, IPhoneInfo, PhoneCallStatus } from '@revolt-rp/common';
import { dayjs } from '../../../../../domain/util/dajys.util';
import { PhoneState, setPhoneCall } from '../../../../../store/phone';
import { Store } from '@ngrx/store';
import { ButtonDirective } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-phone-call',
  standalone: true,
  imports: [CommonModule, ButtonDirective, TranslatePipe],
  templateUrl: './phone-call.component.html',
  styleUrl: './phone-call.component.css'
})
export class PhoneCallComponent {
  @Input() currentCall!: IPhoneCall;
  @Input() phoneInfo!: IPhoneInfo;

  $duration: Observable<string> = interval(1000).pipe(
    startWith(0),
    map(() => {
      const currentTime = dayjs();
      const duration = currentTime.diff(dayjs(this.currentCall.createdAt), 'second');
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${this.pad(minutes)}:${this.pad(seconds)}`;
    })
  );


  constructor(private store: Store<PhoneState>) {
  }

  get isIncoming(): boolean {
    return this.currentCall.receiver === this.phoneInfo.phoneNumber;
  }

  get isRinging(): boolean {
    return this.currentCall.status === PhoneCallStatus.Dialing;
  }

  private pad(number: number): string {
    return number < 10 ? `0${number}`:`${number}`;
  }

  endCall(): void {
    this.store.dispatch(setPhoneCall({ currentCall: null }));
  }

  answerCall(call: IPhoneCall) {
    this.store.dispatch(setPhoneCall({ currentCall: { ...call, status: PhoneCallStatus.Ongoing } }));
  }
}
