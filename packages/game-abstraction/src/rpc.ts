export interface RpcProcedureInfo {
  source: number;
  procedure: string;
}

export interface IRpc {
  register(procedure: string, handler: (...args: unknown[]) => unknown): void;
  unregister(procedure: string): void;
  callClient(target: number, procedure: string, ...args: unknown[]): Promise<unknown>;
  callServer(procedure: string, ...args: unknown[]): Promise<unknown>;
}
