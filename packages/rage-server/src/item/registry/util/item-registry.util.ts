import { itemRegistry } from '../base-item.model';


export const isValidItem = (itemName: string) => itemRegistry.get(itemName) != undefined;

