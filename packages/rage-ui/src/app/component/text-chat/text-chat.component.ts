import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener, Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SafeHtmlPipe } from '../../domain/util/safe-html.pipe';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ICommandBase } from '@revolt-rp/common';
import { RageClientService } from '../../domain/service/rage-client.service';
import { fadeInOutTrigger } from '../../domain/util/animation.util';
import { TranslatePipe } from '@ngx-translate/core';


type ChatApiFn = (...args: never[]) => void | Promise<void>;


@Component({
  selector: 'app-text-chat',
  standalone: true,
  imports: [
    DatePipe,
    SafeHtmlPipe,
    FormsModule,
    AutoCompleteModule,
    TranslatePipe
  ],
  templateUrl: './text-chat.component.html',
  styleUrl: './text-chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInOutTrigger
  ]
})
export class TextChatComponent implements OnInit {
  @Input() commands!: ICommandBase[];

  @ViewChild('messagesList') messagesRef!: ElementRef;
  @ViewChild('chatInput') chatInput!: AutoComplete;

  isActive = false;
  isTyping = false;

  _commandSuggestions: string[] = [];

  showTimestamps = false;

  inputContent: string | null = null;
  messageCount = 0;

  messages: { id: number, content: string, createdAt: Date }[] = [];
  inputHistory: string[] = [];

  historyShiftIdx = -1;

  get commandSuggestions() {
    if (this.inputContent?.startsWith('/') && !this.inputContent.includes(' ')) {
      return this._commandSuggestions;
    }

    return [];
  }

  constructor(private rageClientService: RageClientService, private changeDetectorRef: ChangeDetectorRef) {
  }

  @HostListener('window:keydown', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 't' && this.isActive && !this.isTyping) {
      await this.enableInput(true);
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    const events: Record<string, ChatApiFn> = {
      'chat:push': this.pushInput,
      'chat:clear': this.clearChat,
      'chat:activate': this.activateChat,
      'chat:show': this.showChat
    };

    if (window.mp && !window.mp.fake) {
      for (const fn in events) {
        this.rageClientService.addEvent(fn, events[fn] as VoidFunction);
      }
    }

    window.chatAPI = {
      activate: this.activateChat,
      clear: this.clearChat,
      show: this.showChat,
      push: this.pushInput
    };
  }

  setFocus(enable: boolean): void {
    this.rageClientService.invoke('focus', enable);
  }

  setTypingState(enable: boolean): void {
    this.rageClientService.invoke('setTypingInChatState', enable);
  }

  activateChat = async (toggle: boolean) => {
    if (!toggle && (this.inputContent != null)) {
      await this.enableInput(false);
    }

    this.isActive = toggle;

    this.changeDetectorRef.detectChanges();
    await this.scrollToBottom();
  };

  showChat = async (toggle: boolean) => {
    this.isActive = toggle;
    this.changeDetectorRef.detectChanges();
    await this.scrollToBottom();
  };

  async sendInput() {
    let content = this.inputContent;
    await this.enableInput(false);

    if (content && content.length > 0) {
      this.inputHistory.unshift(content);

      if (content[0] == '/') {
        content = content.substr(1);

        if (window.mp && !window.mp.fake) {
          this.rageClientService.invoke('command', content);
        }
      } else {
        if (window.mp && !window.mp.fake) {
          this.rageClientService.invoke('chatMessage', content);
        }
      }

      this.historyShiftIdx = -1;
    }
  }

  clearChat = () => {
    this.messages = [];
    this.messageCount = 0;

    this.changeDetectorRef.detectChanges();
  };

  pushInput = async (content: string) => {
    this.messageCount++;

    if (content.includes('color')) {
      const span = content.split('"');
      const color = span[1].split(' ');
      content = content.replace(color[1], '#' + color[1]);
    }

    this.messages.push({
      id: this.messageCount,
      createdAt: new Date(),
      content: content
    });

    this.changeDetectorRef.detectChanges();

    if (!this.isTyping)
      await this.scrollToBottom();
  };

  async closeChat() {
    if (this.isActive && this.isTyping) {
      await this.enableInput(false);
    }
  }

  async enableInput(toggle: boolean) {
    if (window.mp && !window.mp.fake) {
      this.setFocus(toggle);
      this.setTypingState(toggle);
    }

    this.isTyping = toggle;

    if (toggle) {
      setTimeout(() => {
        this.chatInput.inputEL?.nativeElement.focus();
        this.inputContent = null;
      }, 50);
    } else {
      this.chatInput.inputEL?.nativeElement.blur();
      this.inputContent = null;
    }
  }

  async scrollToBottom() {
    if (this.messagesRef && this.messagesRef.nativeElement) {
      this.messagesRef.nativeElement.scroll({
        top: this.messagesRef.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  shiftHistory(direction: 'up' | 'down') {
    if (this.inputHistory.length === 0) {
      return;
    }

    if (direction === 'up') {
      if (this.historyShiftIdx < this.inputHistory.length - 1) {
        this.historyShiftIdx++;
      }
    }

    if (direction === 'down') {
      if (this.historyShiftIdx >= 0) {
        this.historyShiftIdx--;
      } else {
        this.inputContent = '';
        return;
      }
    }

    this.inputContent = this.historyShiftIdx >= 0 ? this.inputHistory[this.historyShiftIdx] : '';
  }

  filterCommands(event: AutoCompleteCompleteEvent) {
    if (event.query.startsWith('/') && event.query.length > 3) {
      const cmd = event.query.substr(1);
      this._commandSuggestions = [
        ...new Set(
          this.commands
            .filter((command) => command.name.startsWith(cmd))
            .flatMap((command) => [command.name, ...(command.aliases || [])])
            .map((command) => `/${command}`)
        )
      ];
    } else {
      this._commandSuggestions = [];
    }
  }

}
