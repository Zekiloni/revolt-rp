import { IItem, IPhoneInfo } from '@revolt-rp/common';

declare global {

  interface IPhoneItem extends IItem {
    phoneInfo: IPhoneInfo;
  }

  interface Mp {
    events: EventMpPool;
    fake?: true;

    trigger(name: string, ...args: any[]): void;

    invoke(name: string, ...args: any[]): void;
  }

  interface EventMpPool {
    callProc<T = any>(procName: string, ...args: any[]): Promise<T>;

    add(eventName: string, callback: (...args: any[]) => void): void;

    remove(name: string, handler?: Function): void;

    call(name: string, ...args: any[]): void;
  }

  interface Window {
    mp: Mp;
    chatAPI: {
      push: (text: string) => void;
      clear: () => void;
      activate: (toggle: boolean) => void;
      show: (toggle: boolean) => void;
    };
  }

  let mp: Mp;
}

export {};
