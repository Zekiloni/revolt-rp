export interface PlayerIdentity {
  type: string;
  value: string;
  label?: string;
}

export interface IIdentity {
  getIdentities(src: number): PlayerIdentity[];
  getName(src: number): string;
}
