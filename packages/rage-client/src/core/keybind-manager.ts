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
  onRelease?: KeyBindHandler; // New: handler for key release
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

  const keyBind: KeyBind = { keyCode, handler, keydown, holdTime, startTime: undefined, validators };
  activeKeyBinds.push(keyBind);

  if (holdTime) {
    // Bind keydown to record start time
    mp.keys.bind(keyCode, true, () => {
      if (!canActivateKeyBind(validators)) return;
      keyBind.startTime = Date.now();
    });

    // Bind keyup to check hold duration
    mp.keys.bind(keyCode, false, () => {
      if (!canActivateKeyBind(validators)) return;

      const startTime = keyBind.startTime;
      delete keyBind.startTime;

      if (startTime && Date.now() - startTime >= holdTime) {
        handler();
      }
    });
  } else {
    // For instant triggers, check if there's a hold-time keybind for the same key
    const hasHoldBind = activeKeyBinds.some(
      kb => kb.keyCode === keyCode && kb.holdTime && kb.holdTime > 0
    );

    if (hasHoldBind) {
      // Delay execution to allow hold-time check
      mp.keys.bind(keyCode, keydown, () => {
        if (!canActivateKeyBind(validators)) return;

        const pressTime = Date.now();

        // Use a small delay to check if key is still held
        setTimeout(() => {
          const holdBind = activeKeyBinds.find(
            kb => kb.keyCode === keyCode && kb.holdTime && kb.startTime
          );

          // Only trigger if no hold bind is active OR key was released quickly
          if (!holdBind || !holdBind.startTime || Date.now() - pressTime < 100) {
            handler();
          }
        }, 50);
      });
    } else {
      // No hold bind, trigger immediately
      mp.keys.bind(keyCode, keydown, () => {
        if (!canActivateKeyBind(validators)) return;
        handler();
      });
    }
  }
}

// NEW: Register keybind with both press and release handlers
export function registerKeyBindWithRelease(
  keyCode: number,
  onPress: KeyBindHandler,
  onRelease: KeyBindHandler,
  validators?: KeyBindValidatorFn[]
): void {
  const keyBindId = `${keyCode}_press_release`;

  // Check if already registered
  if (activeKeyBinds.some(kb => kb.keyCode === keyCode && kb.onRelease)) return;

  const keyBind: KeyBind = {
    keyCode,
    handler: onPress,
    keydown: true,
    validators,
    onRelease
  };
  activeKeyBinds.push(keyBind);

  // Bind press
  mp.keys.bind(keyCode, true, () => {
    if (!canActivateKeyBind(validators)) return;
    onPress();
  });

  // Bind release
  mp.keys.bind(keyCode, false, () => {
    if (!canActivateKeyBind(validators)) return;
    onRelease();
  });
}

export function unregisterKeyBind(keyCode: number, handler: KeyBindHandler): void {
  const keyBind = activeKeyBinds.find(
    (kb) => kb.keyCode === keyCode && kb.handler === handler
  );

  if (!keyBind) return;

  mp.keys.unbind(keyCode, keyBind.keydown, handler);

  if (keyBind.holdTime || keyBind.onRelease) {
    mp.keys.unbind(keyCode, false, keyBind.onRelease || handler);
  }

  const index = activeKeyBinds.indexOf(keyBind);
  if (index !== -1) {
    activeKeyBinds.splice(index, 1);
  }
}

// NEW: Unregister press/release keybind
export function unregisterKeyBindWithRelease(keyCode: number, onPress: KeyBindHandler): void {
  const keyBind = activeKeyBinds.find(
    (kb) => kb.keyCode === keyCode && kb.handler === onPress && kb.onRelease
  );

  if (!keyBind) return;

  mp.keys.unbind(keyCode, true, onPress);
  if (keyBind.onRelease) {
    mp.keys.unbind(keyCode, false, keyBind.onRelease);
  }

  const index = activeKeyBinds.indexOf(keyBind);
  if (index !== -1) {
    activeKeyBinds.splice(index, 1);
  }
}

export function isKeyBindRegistered(keycode: number, handler: KeyBindHandler): boolean {
  const keyBind = activeKeyBinds.find(
    kb => kb.keyCode === keycode && kb.handler === handler
  );
  return !!keyBind;
}
