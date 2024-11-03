import { WeaponItem } from './weapon-item.model';
import { CaliberType, ItemType } from '@bcrp-rage/common';


new WeaponItem(
  'Type 56',
  'description',
  RageEnums.Hashes.Weapon.ASSAULTRIFLE,
  CaliberType.CALIBER_7_62_MM,
  'w_ar_assaultrifle',
  [ItemType.WEAPON_ASSAULT_RIFLE],
  3.9
);

new WeaponItem(
  'Desert Eagle',
  'description',
  RageEnums.Hashes.Weapon.PISTOL50,
  CaliberType.CALIBER_50_AE,
  'w_pi_pistol50',
  [ItemType.WEAPON_PISTOL],
  1.85
);
