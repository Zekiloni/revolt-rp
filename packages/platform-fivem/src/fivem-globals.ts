declare global {
  function on(eventName: string, handler: (...args: unknown[]) => void): void;
  function emit(eventName: string, ...args: unknown[]): void;
  function onNet(eventName: string, handler: (...args: unknown[]) => void): void;
  function emitNet(eventName: string, target: number | string, ...args: unknown[]): void;
  function setTick(handler: () => void): number;
  function clearTick(tickId: number): void;
  function GetPlayerIdentifiers(playerSrc: number | string): string[];
  function GetPlayerName(playerSrc: number | string): string;
  function PerformHttpRequest(
    url: string,
    callback: (statusCode: number, body: string, headers: unknown, errorData?: string) => void,
    method?: string,
    data?: string,
    headers?: Record<string, string>,
    options?: { followLocation?: boolean }
  ): number;
}

export {};
