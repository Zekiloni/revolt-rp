//
// import { ItemTypes } from "@shared/enums/ItemEnums"
//
// import { Item } from "@/models"
// import { BaseItem } from "@/models/item/factory/baseItem"
//
//
// export class FoodItem extends BaseItem<FoodItem> {
//    public calories: number
//
// 	constructor(name: string, description: string, type: ItemTypes[], model: string, weight: number, calories: number) {
// 		super(name, description, [ItemTypes.CONSUMABLE, ...type], model, weight)
//
// 		this.calories = calories;
// 	}
//
//    public async use (player: PlayerMp, item: Item) {
// 		if (item.usability) {
// 			item.usability = item.usability - 20;
//
// 			if (item.usability <= 0) {
// 				await item.destroy();
// 			} else {
// 				await item.save();
// 			}
// 		}
//
//       if (this.calories) {
//          // player.character.hunger
//       }
//    }
// }
