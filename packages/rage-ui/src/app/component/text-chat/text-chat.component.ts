import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChipsModule } from 'primeng/chips';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ChatApiFn = (...args: never[]) => void | Promise<void>;

interface ChatApi {
  push: (text: string) => void;
  clear: () => void;
  activate: (toggle: boolean) => void;
  show: (toggle: boolean) => void;
}

@Component({
  selector: 'app-text-chat',
  standalone: true,
  imports: [
    ChipsModule,
    DatePipe,
    FormsModule
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
  messages: { id: number, content: string, createdAt: Date }[] = [];

  inputHistory: string[] = [];
  historyShiftIdx = -1;

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
        await this.enableInput(true);
        event.preventDefault();
      }
    });


    const chatApi: ChatApi = {
      activate: this.activateChat,
      clear: this.clearChat,
      show: this.showChat,
      push: this.pushInput
    };

    window.chatAPI = chatApi;
  }

  setFocus(enable: boolean): void {
    mp.invoke('focus', enable);
  }

  setTypingState(enable: boolean): void {
    mp.invoke('setTypingInChatState', enable);
  }

  activateChat = async (toggle: boolean) => {
    if (!toggle && (this.inputContent != null)) {
      await this.enableInput(false);
    }

    this.isActive = toggle;
  };

  showChat = (toggle: boolean) => {
    this.isActive = toggle;
  }

  async sendInput() {
    let content = this.inputContent;
    await this.enableInput(false);

    if (content && content.length > 0) {
      this.inputHistory.unshift(content);

      if (content[0] == '/') {
        content = content.substr(1);

        if (window.mp && !window.mp.fake) {
          mp.invoke('command', content);
        }
      } else if (content.includes('timestamp')) {
        this.showTimestamps = true;
      } else {
        if (window.mp && !window.mp.fake) {
          mp.invoke('chatMessage', content);
        }
      }

      await this.pushInput(content);
      this.historyShiftIdx = -1;
    }
  }

  clearChat = () => {
    this.messages = [];
    this.messageCount = 0;
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

    await this.scrollToBottom();
  }

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
      this.chatInput.nativeElement.focus();
      this.inputContent = null;
    } else {
      this.chatInput.nativeElement.blur();
      this.inputContent = null;
    }
  }

  async scrollToBottom() {
    this.messagesRef.nativeElement.scroll({
      top: this.messagesRef.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
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
