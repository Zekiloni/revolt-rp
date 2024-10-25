type KeyBindHandler = () => void;

interface KeyBind {
  handler: KeyBindHandler;
  holdTime?: number;
  startTime?: number;
}

const activeKeyBinds: Map<number, Map<boolean, KeyBind>> = new Map();

export function registerKeyBind(keycode: number, keydown: boolean, handler: KeyBindHandler, holdTime = 0): void {
  if (isKeyBindRegistered(keycode, keydown, handler)) return;

  const keyBind: KeyBind = { handler, holdTime };

  if (!activeKeyBinds.has(keycode)) {
    activeKeyBinds.set(keycode, new Map());
  }

  activeKeyBinds.get(keycode)?.set(keydown, keyBind);

  if (keydown && holdTime) {
    mp.keys.bind(keycode, keydown, () => {
      keyBind.startTime = Date.now();
      handler();
    });
  } else {
    mp.keys.bind(keycode, keydown, () => {
      const startTime = keyBind.startTime;
      delete keyBind.startTime;

      if (!startTime || (holdTime && Date.now() - startTime >= holdTime)) {
        handler();
      }
    });
  }
}

export function unregisterKeyBind(keycode: number, keydown: boolean, handler: KeyBindHandler): void {
  const keyBind = activeKeyBinds.get(keycode)?.get(keydown);
  if (keyBind && keyBind.handler === handler) {
    mp.keys.unbind(keycode, keydown);
    activeKeyBinds.get(keycode)?.delete(keydown);

    if (activeKeyBinds.get(keycode)?.size === 0) {
      activeKeyBinds.delete(keycode);
    }
  }
}

export function isKeyBindRegistered(keycode: number, keydown: boolean, handler: KeyBindHandler): boolean {
  const keyBind = activeKeyBinds.get(keycode)?.get(keydown);
  return !!keyBind && keyBind.handler === handler;
}
