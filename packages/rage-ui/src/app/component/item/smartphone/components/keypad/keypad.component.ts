import { CommonModule } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import { StaticAssetPipe } from '../../../../../domain/pipe/static-asset.pipe';
import { playAudio } from '../../../../../domain/util/audio.util';


@Component({
  selector: 'app-keypad',
  standalone: true,
  imports: [CommonModule, ButtonDirective],
  providers: [StaticAssetPipe],
  templateUrl: './keypad.component.html',
  styleUrl: './keypad.component.css'
})
export class KeypadComponent implements OnInit, OnDestroy {
  @Input() phoneItem!: IPhoneItem;

  numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  phoneNumber = '';

  constructor(
    private staticAssetPipe: StaticAssetPipe,
    private rageClientServie: RageClientService
  ) {
  }

  onNumberClick(number: string) {
    if (this.phoneNumber.length >= 10) {
      return;
    }

    if (/^[0-9]$/.test(number)) {
      playAudio(this.staticAssetPipe.transform('assets/audio/phone/dtmf/' + number + '.mp3'), 0.025);
    }

    this.phoneNumber += number;
  }

  clear() {
    this.phoneNumber = '';
  }

  subtract() {
    this.phoneNumber = this.phoneNumber.slice(0, -1);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (/^[0-9]$/.test(event.key)) {
      this.onNumberClick(event.key);
    } else if (event.key === 'Backspace') {
      this.subtract();
    } else if (event.key === 'Enter') {
      this.call();
    }
  }

  call() {
    if (this.phoneNumber.length === 0) {
      return;
    }

    this.rageClientServie.triggerServer(ProcedureKey.SERVER_CREATE_PHONE_CALL, this.phoneNumber);
  }


  async ngOnInit() {
    this.rageClientServie.invoke('setTypingInChatState', true);
  }

  ngOnDestroy() {
    this.rageClientServie.invoke('setTypingInChatState', false);
  }
}
