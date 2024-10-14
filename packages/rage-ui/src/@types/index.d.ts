declare global {

  interface Mp {
    events: EventMpPool;
    fake?: true;

    trigger(name: string, ...args: any[]): void;

    invoke(name: string, ...args: any[]): void;
  }

  interface EventMpPool {
    callProc<T = any>(procName: string, ...args: any[]): Promise<T>;

    add: {
      (name: string, ...args: any[]): void;
      (names: { [name: string]: (...args: any[]) => void }): void;
    };

    remove(name: string, handler?: Function): void;

    call(name: string, ...args: any[]): void;
  }

  interface Window {
    mp: Mp;
    chatAPI: any;
  }

  let mp: Mp;
}

export {}
