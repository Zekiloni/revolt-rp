import { IBaseItem } from '@bcrp-rage/common';

export const getItemIcon = (item: IBaseItem) => {
  return `/assets/images/items/${item.model}.png`;
};
