export const saveStorage = <T>(key: string, value: T) => {
  mp.storage.data[key] = value;
};

export const getStorage = <T>(key: string) => {
  return mp.storage.data[key] as T;
};

export const flushStorage = () => {
  mp.storage.flush();
};
