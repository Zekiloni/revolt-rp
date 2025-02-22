import { IBaseItem } from '@revolt-rp/common';

export const getItemIcon = (item: IBaseItem) => {
  return `assets/images/items/${item.model}.png`;
};
