import { HexKeyCodes } from '@revolt-rp/common';

type KeyBindHandler = () => void;
type KeyBindValidatorFn = () => boolean;

interface KeyBind {
  keyCode: HexKeyCodes;
  handler: KeyBindHandler;
  keydown: boolean;
  holdTime?: number;
  startTime?: number;
  validators?: KeyBindValidatorFn[];
}

const activeKeyBinds: KeyBind[] = [];

export const canActivateKeyBind = (validators: KeyBindValidatorFn[] = []): boolean => {
  return !mp.players.local.isTypingInTextChat && validators.every(validator => validator());
};

export function registerKeyBind(
  keyCode: number,
  keydown: boolean,
  handler: KeyBindHandler,
  holdTime = 0,
  validators?: KeyBindValidatorFn[]
): void {
  if (isKeyBindRegistered(keyCode, handler)) return;

  const keyBind: KeyBind = { keyCode, handler, keydown, holdTime, startTime: undefined };
  activeKeyBinds.push(keyBind);

  if (holdTime) {
    mp.keys.bind(keyCode, true, () => {
      if (!canActivateKeyBind(validators)) return;
      keyBind.startTime = Date.now();
    });
    mp.keys.bind(keyCode, false, () => {
      if (!canActivateKeyBind(validators)) return;

      const startTime = keyBind.startTime;
      delete keyBind.startTime;

      if (!holdTime || (startTime && Date.now() - startTime >= holdTime)) {
        handler();
      }
    });
  } else {
    mp.keys.bind(keyCode, true, () => {
      if (!canActivateKeyBind(validators)) return;
      handler();
    });
  }
}

export function unregisterKeyBind(keyCode: number, handler: KeyBindHandler): void {
  const keyBind = activeKeyBinds.find(
    (keyBind) => keyBind.keyCode === keyCode && keyBind.handler === handler
  );

  if (!keyBind) return;

  mp.keys.unbind(keyCode, keyBind.keydown, handler);

  if (keyBind.holdTime)
    mp.keys.unbind(keyCode, false, handler);

  const index = activeKeyBinds.indexOf(keyBind);
  if (index !== -1) {
    activeKeyBinds.splice(index, 1);
  }
}

export function isKeyBindRegistered(keycode: number, handler: KeyBindHandler): boolean {
  const keyBind = activeKeyBinds.find(keyBind => keyBind.keyCode === keycode && keyBind.handler === handler);
  return !!keyBind && keyBind.handler === handler;
}
