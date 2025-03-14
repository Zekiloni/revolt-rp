import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import {
  callBrowsers as rpcCallBrowsers,
  callClient as rpcCallClient,
  callServer as rpcCallServer,
  off as rpcOff,
  on as rpcOn,
  ProcedureListener,
  register as rpcRegister,
  triggerBrowsers as rpcTriggerBrowsers,
  triggerClient as rpcTriggerClient,
  triggerServer as rpcTriggerServer,
  unregister as rpcUnregister
} from '@libertymp/rage-rpc';
import { ApiError } from '@revolt-rp/common';


type MpInvokeNative = 'setTypingInChatState' | 'focus' | string;

@Injectable()
export class RageClientService {
  private socket: WebSocket | null = null;

  constructor(private ngZone: NgZone) {
  }

  openSocket(url: string) {
    this.socket = new WebSocket(url);
  }

  trigger(name: string, ...args: unknown[]) {
    mp.trigger(name, ...args);
  }

  addEvent(name: string, callback: (...args: any[]) => void) {
    mp.events.add(name, callback);
  }

  removeEvent(name: string, callback: (...args: any[]) => void) {
    mp.events.remove(name, callback);
  }

  callEvent(name: string, ...args: unknown[]) {
    mp.events.call(name, ...args);
  }

  /**
   * Mostly will be unused as we are using rage-rpc
   * @param name
   * @param args
   */
  callProc(name: string, ...args: unknown[]) {
    return mp.events.callProc(name, ...args);
  }

  invoke(name: MpInvokeNative, ...args: unknown[]) {
    mp.invoke(name, ...args);
  }

  triggerServer(name: string, args: unknown) {
    rpcTriggerServer(name, args);
  }

  triggerClient(name: string, args?: unknown) {
    rpcTriggerClient(name, args);
  }

  on(name: string, callback: ProcedureListener) {
    this.ngZone.runOutsideAngular(() => {
      rpcOn(name, (...args) => this.ngZone.run(() => callback(...args)));
    });
  }

  off(name: string, callback: ProcedureListener) {
    rpcOff(name, callback);
  }

  register(name: string, callback: ProcedureListener) {
    rpcRegister(name, callback);
  }

  unregister(name: string) {
    rpcUnregister(name);
  }

  triggerBrowsers(name: string, args: unknown) {
    rpcTriggerBrowsers(name, args);
  }

  callServer<T>(name: string, args?: unknown): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      rpcCallServer(name, args)
        .then((result: T) => {
          this.ngZone.run(() => {
            if ((result as ApiError).error) {
              observer.error(result);
              return;
            }
            observer.next(result);
            observer.complete();
          });
        })
        .catch((err) => observer.error(err));
    });
  }

  callClient<T>(name: string, args?: unknown): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      rpcCallClient(name, args)
        .then((result: T) => {
          if ((result as ApiError).error) {
            observer.error(result);
            return;
          }
          observer.next(result);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  callBrowsers<T>(name: string, args: unknown): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      rpcCallBrowsers(name, args)
        ?.then((result: T) => {
          observer.next(result);
          observer.complete();
        })
        .catch((error: unknown) => {
          observer.error(error);
        });
    });
  }
}
