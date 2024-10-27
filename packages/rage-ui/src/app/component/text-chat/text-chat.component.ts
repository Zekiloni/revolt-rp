import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChipsModule } from 'primeng/chips';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type ChatApiFn = (...args: never[]) => void | Promise<void>;


@Component({
  selector: 'app-text-chat',
  standalone: true,
  imports: [
    ChipsModule,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './text-chat.component.html',
  styleUrl: './text-chat.component.scss'
})
export class TextChatComponent implements OnInit {
  @ViewChild('messagesList') messagesRef!: ElementRef;
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;

  isActive = false;
  isTyping = false;
  showTimestamps = false;

  inputContent: string | null = null;

  messageCount = 0;
  messages: { id: number, content: SafeHtml, createdAt: Date }[] = [];

  inputHistory: string[] = [];
  historyShiftIdx = -1;

  constructor(private sanitizer: DomSanitizer) {
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
        mp.events.add(fn, events[fn]);
      }
    }

    window.addEventListener('keydown', async (event: KeyboardEvent) => {
      if (event.key === 't' && this.isActive && !this.isTyping) {
        this.enableInput(true);
        event.preventDefault();
      }
    });


    window.chatAPI = {
      activate: this.activateChat,
      clear: this.clearChat,
      show: this.showChat,
      push: this.pushInput
    };
  }

  setFocus(enable: boolean): void {
    mp.invoke('focus', enable);
  }

  setTypingState(enable: boolean): void {
    mp.invoke('setTypingInChatState', enable);
  }

  activateChat = async (toggle: boolean) => {
    if (!toggle && (this.inputContent != null)) {
      this.enableInput(false);
    }

    this.isActive = toggle;
  };

  showChat = (toggle: boolean) => {
    this.isActive = toggle;
  }

  async sendInput() {
    let content = this.inputContent;
    this.enableInput(false);

    if (content && content.length > 0) {
      this.inputHistory.unshift(content);

      if (content[0] == '/') {
        content = content.substr(1);

        if (window.mp && !window.mp.fake) {
          mp.invoke('command', content);
        }
      } else if (content.includes('timestamp')) {
        this.showTimestamps = !this.showTimestamps;
      } else {
        if (window.mp && !window.mp.fake) {
          mp.invoke('chatMessage', content);
        }
      }

      this.historyShiftIdx = -1;
    }
  }

  clearChat = () => {
    this.messages = [];
    this.messageCount = 0;
  };

  pushInput = async (content: string) => {
    this.messageCount++;
    console.log('new text content', content);
    if (content.includes('color')) {
      const span = content.split('"');
      const color = span[1].split(' ');
      content = content.replace(color[1], '#' + color[1]);
    }

    this.messages.push({
      id: this.messageCount,
      createdAt: new Date(),
      content: this.sanitizer.bypassSecurityTrustHtml(content)
    });

    await this.scrollToBottom();
  }

  async closeChat() {
    if (this.isActive && this.isTyping) {
      this.enableInput(false);
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
        this.chatInput.nativeElement.focus();
        this.inputContent = null;
      });
    } else {
      this.chatInput.nativeElement.blur();
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

}
