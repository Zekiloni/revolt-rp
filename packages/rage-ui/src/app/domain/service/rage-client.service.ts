import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import {
  on as rpcOn,
  off as rpcOff,
  register as rpcRegister,
  unregister as rpcUnregister,
  triggerServer as rpcTriggerServer,
  triggerClient as rpcTriggerClient,
  callServer as rpcCallServer,
  callClient as rpcCallClient,
  callBrowsers as rpcCallBrowsers,
  triggerBrowsers as rpcTriggerBrowsers,
  ProcedureListener
} from '@libertymp/rage-rpc';
import { ApiError } from '@revolt-rp/common';

@Injectable()
export class RageClientService {

  trigger(name: string, ...args: unknown[]) {
    mp.trigger(name, ...args);
  }

  addEvent(name: string, callback: (...args: any[]) => void) {
    mp.events.add(name, callback);
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

  invoke(name: string, ...args: unknown[]) {
    mp.invoke(name, ...args);
  }

  triggerServer(name: string, args: unknown) {
    rpcTriggerServer(name, args);
  }

  triggerClient(name: string, args?: unknown) {
    rpcTriggerClient(name, args);
  }

  on(name: string, callback: ProcedureListener) {
    rpcOn(name, callback);
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
