import { WeaponItem } from './weapon-item.model';
import { CaliberType, ItemType } from '@revolt-rp/common';
import { DrinkItemModel } from './drink-item.model';

new DrinkItemModel("Water Bottle", "Flow water bottle, contains 0.3l of pure taste of water.", [], 'prop_ld_flow_bottle', 0.3)
new DrinkItemModel("Beer Bottle", "Pißwasser beer bottle, contains 0.3l of best German beer.", [ItemType.BEVERAGE], 'prop_amb_beer_bottle', 0.3, 4)


new WeaponItem('Ruger Mark IV', 'A popular semi-automatic target pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_22_LR, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.5);
new WeaponItem('Smith & Wesson Model 22', 'A classic .22 caliber revolver known for its accuracy.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_22_LR, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.6);
new WeaponItem('Walther P22', 'A compact and lightweight .22 caliber pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_22_LR, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.55);
new WeaponItem('Beretta Neos', 'A modern and versatile .22 caliber pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_22_LR, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.5);

