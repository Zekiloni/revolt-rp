import { IIdentity, PlayerIdentity } from '@revolt-rp/game-abstraction';

export const parseIdentifier = (raw: string): PlayerIdentity => {
  const separator = raw.indexOf(':');

  if (separator === -1) {
    return { type: 'unknown', value: raw };
  }

  return {
    type: raw.slice(0, separator),
    value: raw.slice(separator + 1)
  };
};

export const createFivemIdentity = (): IIdentity => ({
  getIdentities: (src) => GetPlayerIdentifiers(src).map(parseIdentifier),
  getName: (src) => GetPlayerName(src)
});
