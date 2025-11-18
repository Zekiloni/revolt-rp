import { AddictionType } from '@revolt-rp/common';
import { Item } from '@revolt-rp/core';

type DrugUseHandler = (player: PlayerMp, item: Item) => Promise<void> | void;


export const drugHandlers: Partial<Record<AddictionType, DrugUseHandler>> = {
  [AddictionType.Cannabis]: playerUseCannabis,
  [AddictionType.Cocaine]: playerUseCocaine,
  [AddictionType.Ecstasy]: playerUseEcstasy,
  [AddictionType.Heroin]: playerUseHeroin,
  [AddictionType.Crack]: playerUseCrack,
  [AddictionType.Meth]: playerUseMeth,
  [AddictionType.Acid]: playerUseAcid,
  [AddictionType.Morphine]: playerUseMorphine,
  [AddictionType.Dianabol]: playerUseDianabol,
  [AddictionType.PCP]: playerUsePCP,
  [AddictionType.Shrooms]: playerUseShrooms,
};

function playerUseCannabis(player: PlayerMp, item: Item) {
  throw new Error('Cannabis use not implemented.');
}

function playerUseCocaine(player: PlayerMp, item: Item) {
  throw new Error('Cocaine use not implemented.');
}

function playerUseEcstasy(player: PlayerMp, item: Item) {
  throw new Error('Ecstasy use not implemented.');
}

function playerUseHeroin(player: PlayerMp, item: Item) {
  throw new Error('Heroin use not implemented.');
}

function playerUseCrack(player: PlayerMp, item: Item) {
  throw new Error('Crack use not implemented.');
}

function playerUseMeth(player: PlayerMp, item: Item) {
  throw new Error('Meth use not implemented.');
}

function playerUseMorphine(player: PlayerMp, item: Item) {
  throw new Error('Morphine use not implemented.');
}

function playerUseDianabol(player: PlayerMp, item: Item) {
  throw new Error('Dianabol use not implemented.');
}

function playerUsePCP(player: PlayerMp, item: Item) {
  throw new Error('PCP use not implemented.');
}

function playerUseShrooms(player: PlayerMp, item: Item) {
  throw new Error('Shrooms use not implemented.');
}

function playerUseAcid(player: PlayerMp, item: Item) {
  throw new Error('Acid use not implemented.');
}
