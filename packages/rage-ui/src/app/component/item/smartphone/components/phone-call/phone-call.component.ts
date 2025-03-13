import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { interval, map, Observable, startWith } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { IPhoneCall, IPhoneInfo, PhoneCallStatus } from '@revolt-rp/common';
import { dayjs } from '../../../../../domain/util/dajys.util';


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

  @Output() answerCall = new EventEmitter<IPhoneCall>();
  @Output() endCall = new EventEmitter<IPhoneCall>();

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

  get isIncoming(): boolean {
    return this.currentCall.receiver === this.phoneInfo.phoneNumber;
  }

  get isOngoing(): boolean {
    return this.currentCall.status === PhoneCallStatus.Ongoing;
  }

  get isEndedOrRejected(): boolean {
    return this.currentCall.status === PhoneCallStatus.Ended || this.currentCall.status === PhoneCallStatus.Rejected;
  }

  get isRinging(): boolean {
    return this.currentCall.status === PhoneCallStatus.Dialing;
  }

  private pad(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }

  end(): void {
    this.endCall.emit(this.currentCall);
  }

  answer(call: IPhoneCall) {
    this.answerCall.emit(call);
  }
}
