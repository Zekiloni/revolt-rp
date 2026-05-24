import { on as rpcOn } from '@libertymp/rage-rpc';


export const registerEvent = <T = unknown>(eventName: string, handler: (data: T) => void) => {
    mp.events.add(eventName, handler as any);
}

export const registerRpcProc = <T = unknown, R = unknown>(procName: string, handler: (data: T) => Promise<R>) => {
  rpcOn(procName, handler as any);
}

export const registerProc = <T = unknown, R = unknown>(procName: string, handler: (data: T) => R) => {
    mp.events.addProc(procName, handler as any);
}

export const triggerEvent = <T = unknown>(eventName: string, data?: T) => {
    mp.events.call(eventName, data);
}

// Instrumentation / interceptors
export type EventMeta = {
  id: string;
  eventName: string;
  source?: string;
  timestamp: string;
  nodeId?: string;
};

export type EventEnvelope = {
  meta: EventMeta;
  payload: unknown[];
};

export type CommandEnvelope = {
  meta: EventMeta & { commandName: string; requestId?: string };
  payload: unknown;
};

export type EntityMapper = (arg: unknown) => unknown;

export type InstrumentationOptions = {
  whitelist?: Array<string | RegExp>;
  blacklist?: Array<string | RegExp>;
  publishRpc?: boolean; // whether to intercept rage-rpc `on` handlers
  entityMapper?: EntityMapper;
  sourceName?: string;
};

let instrumentationInstalled = false;

function generateUUID() {
  // simple UUID-like string for event ids
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function defaultEntityMapper(arg: unknown) {
  try {
    if (!arg || typeof arg !== 'object') return arg;
    const anyArg = arg as Record<string, unknown>;
    // PlayerMp detection (common pattern in codebase)
    if ('character' in anyArg && anyArg.character && typeof (anyArg.character as any).id !== 'undefined') {
      return { __type: 'player', id: (anyArg.character as any).id, name: (anyArg as any).name };
    }
    // VehicleMp detection
    if ('info' in anyArg && anyArg.info && ( (anyArg.info as any).id || (anyArg.info as any)._id)) {
      return { __type: 'vehicle', id: (anyArg.info as any).id ?? (anyArg.info as any)._id };
    }
    // Colshape/marker/dummy - try safe summarization
    if ('type' in anyArg && 'id' in anyArg) {
      return { __type: 'entity', id: (anyArg as any).id, entityType: (anyArg as any).type };
    }
    // Fallback: return primitive-safe representation for objects with id
    if ('id' in anyArg) return { __type: 'object', id: (anyArg as any).id };
  } catch (e) {
    // ignore mapping errors
  }
  return arg;
}

function matchesPattern(name: string, patterns?: Array<string | RegExp>) {
  if (!patterns || !patterns.length) return false;
  for (const p of patterns) {
    if (typeof p === 'string') {
      if (p === name) return true;
    } else {
      if (p.test(name)) return true;
    }
  }
  return false;
}

/**
 * Install interceptors for mp.events and optionally rage-rpc `on`.
 * - eventBus must expose `publish(envelope: EventEnvelope | CommandEnvelope): Promise<void> | void`.
 * - Must be called early in bootstrap before other modules register handlers.
 */
export function installEventInstrumentation(eventBus: { publish?: (envelope: EventEnvelope | CommandEnvelope) => Promise<void> | void }, opts: InstrumentationOptions = {}) {
  if (instrumentationInstalled) return;
  instrumentationInstalled = true;

  const entityMapper: EntityMapper = opts.entityMapper ?? defaultEntityMapper;
  const sourceName = opts.sourceName ?? 'adapter.rage-mp';

  const mpEvents: any = (mp as any).events;
  if (!mpEvents) {
    console.warn('installEventInstrumentation: mp.events not available in this environment');
    return;
  }

  const originalAdd = mpEvents.add.bind(mpEvents);
  const originalRemove = (mpEvents.remove && mpEvents.remove.bind(mpEvents)) || undefined;
  const originalAddDataHandler = (mpEvents.addDataHandler && mpEvents.addDataHandler.bind(mpEvents)) || undefined;
  const originalAddProc = (mpEvents.addProc && mpEvents.addProc.bind(mpEvents)) || undefined;

  const wrappedMap = new WeakMap<(...args: unknown[]) => unknown, (...args: unknown[]) => unknown>();

  function shouldPublish(eventName: string) {
    if (opts.blacklist && matchesPattern(eventName, opts.blacklist)) return false;
    if (opts.whitelist && opts.whitelist.length) return matchesPattern(eventName, opts.whitelist);
    return true; // default publish all
  }

  function wrapHandler(eventName: string, handler: (...args: unknown[]) => unknown) {
    const existing = wrappedMap.get(handler);
    if (existing) return existing;

    const wrapped = function (this: unknown, ...args: unknown[]) {
      // Normalize args using entityMapper
      const normalized = args.map(a => {
        try { return entityMapper(a); } catch { return undefined; }
      });

      const envelope: EventEnvelope = {
        meta: {
          id: generateUUID(),
          eventName,
          source: sourceName,
          timestamp: new Date().toISOString()
        },
        payload: normalized
      };

      // publish async to avoid blocking engine handlers
      try {
        Promise.resolve().then(() => {
          try { return eventBus.publish?.(envelope); } catch (err) { console.error('EventBus.publish error', err); }
        });
      } catch (e) {
        console.error('Event instrumentation publish failed', e);
      }

      // call original handler
      try {
        return (handler as (...a: unknown[]) => unknown).apply(this, args);
      } catch (err) {
        // preserve behavior but log
        console.error(`Error in handler for ${eventName}`, err);
        throw err;
      }
    };

    wrappedMap.set(handler, wrapped);
    return wrapped;
  }

  // Override mp.events.add
  mpEvents.add = function (nameOrMap: unknown, maybeHandler?: unknown) {
    if (typeof nameOrMap === 'string' && typeof maybeHandler === 'function') {
      const name = nameOrMap as string;
      const handler = maybeHandler as (...args: unknown[]) => unknown;
      if (!shouldPublish(name)) return originalAdd(name, handler as any);
      const wrapped = wrapHandler(name, handler);
      return originalAdd(name, wrapped as any);
    }

    if (typeof nameOrMap === 'object' && nameOrMap !== null) {
      const map: Record<string, unknown> = {};
      for (const k of Object.keys(nameOrMap as Record<string, unknown>)) {
        const handler = (nameOrMap as Record<string, unknown>)[k] as unknown;
        if (typeof handler === 'function' && shouldPublish(k)) {
          map[k] = wrapHandler(k, handler as (...args: unknown[]) => unknown) as any;
        } else {
          map[k] = handler;
        }
      }
      return originalAdd(map as any);
    }

    return originalAdd(nameOrMap as any, maybeHandler as any);
  };

  // Override addDataHandler if present
  if (originalAddDataHandler) {
    mpEvents.addDataHandler = function (name: string, handler: (...args: unknown[]) => unknown) {
      if (!shouldPublish(name)) return originalAddDataHandler(name, handler as any);
      const wrapped = wrapHandler(name, handler);
      return originalAddDataHandler(name, wrapped as any);
    };
  }

  // Optionally wrap addProc so handlers for proc are also published
  if (originalAddProc) {
    mpEvents.addProc = function (procName: string, handler: (...args: unknown[]) => unknown) {
      if (!shouldPublish(procName)) return originalAddProc(procName, handler as any);
      const wrapped = wrapHandler(procName, handler);
      return originalAddProc(procName, wrapped as any);
    };
  }

  // Override remove to unwrap
  if (originalRemove) {
    mpEvents.remove = function (nameOrHandler: unknown, maybeHandler?: unknown) {
      if (typeof nameOrHandler === 'function') {
        const orig = nameOrHandler as (...args: unknown[]) => unknown;
        const wrapped = wrappedMap.get(orig) || orig;
        return originalRemove(wrapped as any);
      }

      if (typeof nameOrHandler === 'string' && typeof maybeHandler === 'function') {
        const wrapped = wrappedMap.get(maybeHandler as (...args: unknown[]) => unknown) || maybeHandler;
        return originalRemove(nameOrHandler as string, wrapped as any);
      }

      return originalRemove(nameOrHandler as any, maybeHandler as any);
    };
  }

  // Optionally intercept rage-rpc 'on' so commands get published too
  if (opts.publishRpc) {
    try {
      // Best-effort: wrap registerRpcProc exported above so registrations publish command envelopes
      // Note: we cannot reliably reassign the imported `rpcOn` function for other modules.
      // Instead, consumer code should use `registerRpcProc` from this module so we can wrap.
    } catch (e) {
      console.warn('Failed to instrument rage-rpc on()', e);
    }
  }

}

// enhance existing exported helpers to use instrumentation-aware registration if needed

export const installDefaultInstrumentation = (eventBus: { publish?: (envelope: EventEnvelope | CommandEnvelope) => Promise<void> | void }, opts: InstrumentationOptions = {}) => {
  installEventInstrumentation(eventBus, opts);
};
