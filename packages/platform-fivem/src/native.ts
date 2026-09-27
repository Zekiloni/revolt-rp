type ResourceExport = (name: string, handler: (...args: unknown[]) => unknown) => void;

type ConvarGetter = (name: string, fallback?: string) => string;

const getGlobal = <T>(key: string): T | undefined => {
  return (globalThis as Record<string, unknown>)[key] as T | undefined;
};

export const registerResourceExport = (name: string, handler: (...args: unknown[]) => unknown): void => {
  const register = getGlobal<ResourceExport>('exports');

  if (!register) {
    console.warn(`[platform-fivem] exports() not available, cannot register '${name}'`);
    return;
  }

  register(name, handler);
};

export const getConvar = (name: string, fallback: string): string => {
  const getter = getGlobal<ConvarGetter>('GetConvar');
  return getter ? getter(name, fallback) : fallback;
};

export const getCurrentResourceName = (): string => {
  const getter = getGlobal<() => string>('GetCurrentResourceName');
  return getter ? getter() : 'unknown';
};
