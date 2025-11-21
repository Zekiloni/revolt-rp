import { WeaponItem } from './weapon-item.model';
import { AddictionType, CaliberType, ItemType, PlayerAttachmentTypeEnum } from '@revolt-rp/common';
import { DrinkItemModel } from './drink-item.model';
import { AmmoItem } from './ammo-item.model';
import { BankCardItem } from './bank-card-item.model';
import { WearableItem } from './clothing/wearable-item.model';
import { ArmourItem } from './equipment/armour-item.model';
import { HandheldRadioItemModel } from './electronic/handheld-radio-item.model';
import { SmartphoneItemModel } from './electronic/smartphone-item.model';
import { LicenseItem } from './license-item.model';
import { CuffItem } from './utility/cuff-item.model';
import { FishingRodItem } from './utility/fishing-rod-item.model';
import { MiscellaneousItem } from './miscellaneous-item.model';
import { FoodItem } from './food.item.model';
import { DrugItem } from './drug-item.model';

new DrinkItemModel('Flow 0.3l', 'items.flow_water_bottle_description', [ItemType.PRODUCT_GROCERY], 'prop_ld_flow_bottle', 0.3, 0, PlayerAttachmentTypeEnum.HoldLdFlowBottle);
new DrinkItemModel('Pißwasser 0.35l', 'items.pibwasser_beer_bottle_description', [ItemType.PRODUCT_GROCERY, ItemType.BEVERAGE], 'prop_amb_beer_bottle', 0.35, 4, PlayerAttachmentTypeEnum.HoldAmbBeerBottle);


new WeaponItem('Ruger Mark IV', 'items.ruger_mark_description.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_22_LR, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.5);
new WeaponItem('Smith & Wesson Model 22', 'A classic .22 caliber revolver known for its accuracy.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_22_LR, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.6);
new WeaponItem('Walther P22', 'A compact and lightweight .22 caliber pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_22_LR, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.55);
new WeaponItem('Beretta Neos', 'A modern and versatile .22 caliber pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_22_LR, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.5);

new WeaponItem('Beretta 950 Jetfire', 'A small, lightweight pocket pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_25_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.3);
new WeaponItem('Bersa Firestorm .25', 'Compact and reliable .25 caliber pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_25_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.35);
new WeaponItem('Raven MP-25', 'An inexpensive and compact .25 caliber pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_25_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.32);

new WeaponItem('Walther PPK', 'A classic compact pistol often associated with espionage.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_32_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.8);
new WeaponItem('Bersa Thunder .32', 'A reliable .32 caliber pistol with a lightweight design.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_32_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.75);
new WeaponItem('Beretta 3032 Tomcat', 'A compact .32 caliber pistol for concealed carry.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_32_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.78);

new WeaponItem('Glock 42', 'A lightweight Glock model designed for concealed carry.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_380_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.6);
new WeaponItem('Sig Sauer P238', 'A compact 1911-style pistol in .380 ACP.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_380_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.7);
new WeaponItem('Ruger LCP', 'A compact and easy-to-conceal .380 caliber pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_380_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.55);
new WeaponItem('Smith & Wesson M&P Shield .380 EZ', 'A reliable and user-friendly .380 caliber pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_380_ACP, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.65);

// Medium Caliber Pistols
new WeaponItem('Glock 19', 'A versatile and widely used 9mm pistol.', RageEnums.Hashes.Weapon.COMBATPISTOL, CaliberType.CALIBER_9_MM, 'w_pi_combatpistol', [ItemType.WEAPON_PISTOL], 0.9);
new WeaponItem('Sig Sauer P320', 'A modular pistol favored by law enforcement.', RageEnums.Hashes.Weapon.COMBATPISTOL, CaliberType.CALIBER_9_MM, 'w_pi_combatpistol', [ItemType.WEAPON_PISTOL], 0.95);
new WeaponItem('Smith & Wesson M&P 9', 'A popular choice for personal defense.', RageEnums.Hashes.Weapon.COMBATPISTOL, CaliberType.CALIBER_9_MM, 'w_pi_combatpistol', [ItemType.WEAPON_PISTOL], 0.9);
new WeaponItem('Walther PPQ', 'A modern pistol known for its ergonomics.', RageEnums.Hashes.Weapon.COMBATPISTOL, CaliberType.CALIBER_9_MM, 'w_pi_combatpistol', [ItemType.WEAPON_PISTOL], 0.95);

new WeaponItem('Smith & Wesson Model 10', 'A classic revolver chambered in .38 Special.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_38_SPECIAL, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.0);
new WeaponItem('Ruger GP100', 'A robust revolver known for its durability.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_38_SPECIAL, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.2);
new WeaponItem('Taurus Model 856', 'A compact revolver for personal protection.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_38_SPECIAL, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.1);

new WeaponItem('Glock 22', 'A full-size service pistol in .40 S&W.', RageEnums.Hashes.Weapon.COMBATPISTOL, CaliberType.CALIBER_40_S_W, 'w_pi_combatpistol', [ItemType.WEAPON_PISTOL], 1.0);
new WeaponItem('Smith & Wesson M&P40', 'A reliable choice for law enforcement.', RageEnums.Hashes.Weapon.COMBATPISTOL, CaliberType.CALIBER_40_S_W, 'w_pi_combatpistol', [ItemType.WEAPON_PISTOL], 1.1);
new WeaponItem('Springfield XD .40', 'A modern polymer-framed pistol.', RageEnums.Hashes.Weapon.COMBATPISTOL, CaliberType.CALIBER_40_S_W, 'w_pi_combatpistol', [ItemType.WEAPON_PISTOL], 1.1);

new WeaponItem('Smith & Wesson Model 29', 'A powerful revolver chambered in .44 Special.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_44_SPECIAL, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.2);
new WeaponItem('Charter Arms Bulldog', 'A compact revolver popular for concealed carry.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_44_SPECIAL, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.1);

new WeaponItem('Smith & Wesson Model 686', 'A stainless steel revolver chambered in .357 Magnum.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_357_MAGNUM, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.3);
new WeaponItem('Ruger GP100', 'A heavy-duty revolver designed for .357 Magnum.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_357_MAGNUM, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.4);

new WeaponItem('Colt 1911', 'An iconic .45 caliber pistol known for its reliability.', RageEnums.Hashes.Weapon.PISTOL50, CaliberType.CALIBER_45_ACP, 'w_pi_pistol50', [ItemType.WEAPON_PISTOL], 1.1);
new WeaponItem('Glock 21', 'A full-size .45 caliber Glock pistol.', RageEnums.Hashes.Weapon.PISTOL50, CaliberType.CALIBER_45_ACP, 'w_pi_pistol50', [ItemType.WEAPON_PISTOL], 1.2);
new WeaponItem('Springfield XD .45 ACP', 'A modern and ergonomic .45 caliber pistol.', RageEnums.Hashes.Weapon.PISTOL50, CaliberType.CALIBER_45_ACP, 'w_pi_pistol50', [ItemType.WEAPON_PISTOL], 1.2);

// Large Caliber Pistols
new WeaponItem('Smith & Wesson Model 500', 'A powerful revolver designed for large calibers.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_500_S_W, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.5);
new WeaponItem('Desert Eagle', 'A legendary pistol chambered in .50 AE.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_50_AE, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.4);

// Specialty Pistols
new WeaponItem('Ruger Vaquero', 'A cowboy-style revolver suitable for single-action shooting.', RageEnums.Hashes.Weapon.REVOLVER, CaliberType.CALIBER_45_COLT, 'w_pi_revolver_mk2', [ItemType.WEAPON_PISTOL], 1.3);
new WeaponItem('Glock 20', 'A powerful 10mm pistol for hunting and self-defense.', RageEnums.Hashes.Weapon.PISTOL50, CaliberType.CALIBER_10MM_AUTO, 'w_pi_pistol50', [ItemType.WEAPON_PISTOL], 1.2);
new WeaponItem('Springfield XD-M 10mm', 'A versatile pistol with a high magazine capacity.', RageEnums.Hashes.Weapon.PISTOL50, CaliberType.CALIBER_10MM_AUTO, 'w_pi_pistol50', [ItemType.WEAPON_PISTOL], 1.2);
new WeaponItem('Sig Sauer P229', 'A reliable pistol used by military and law enforcement.', RageEnums.Hashes.Weapon.COMBATPISTOL, CaliberType.CALIBER_357_SIG, 'w_pi_combatpistol', [ItemType.WEAPON_PISTOL], 1.0);
new WeaponItem('Glock 31', 'A Glock model designed for .357 SIG ammunition.', RageEnums.Hashes.Weapon.COMBATPISTOL, CaliberType.CALIBER_357_SIG, 'w_pi_combatpistol', [ItemType.WEAPON_PISTOL], 1.1);
new WeaponItem('Glock 37', 'A full-sized pistol in .45 GAP caliber.', RageEnums.Hashes.Weapon.PISTOL50, CaliberType.CALIBER_45_GAP, 'w_pi_pistol50', [ItemType.WEAPON_PISTOL], 1.0);
new WeaponItem('Glock 38', 'A compact Glock model chambered in .45 GAP.', RageEnums.Hashes.Weapon.PISTOL50, CaliberType.CALIBER_45_GAP, 'w_pi_pistol50', [ItemType.WEAPON_PISTOL], 1.0);

new WeaponItem('Heckler & Koch MP5', 'A highly reliable and widely used 9mm SMG.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_9_MM_PARABELLUM, 'w_sb_smg', [ItemType.WEAPON_SUB_MACHINE], 2.5);
new WeaponItem('Uzi', 'A classic 9mm submachine gun known for durability and simplicity.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_9_MM_PARABELLUM, 'w_sb_microsmg', [ItemType.WEAPON_SUB_MACHINE], 2.8);
new WeaponItem('SIG MPX', 'A modern modular 9mm SMG used by law enforcement.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_9_MM_PARABELLUM, 'w_sb_pdw', [ItemType.WEAPON_SUB_MACHINE], 2.7);
new WeaponItem('CZ Scorpion EVO 3', 'A lightweight and ergonomic 9mm SMG.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_9_MM_PARABELLUM, 'w_sb_minismg', [ItemType.WEAPON_SUB_MACHINE], 2.6);
new WeaponItem('Beretta M12', 'An Italian 9mm SMG known for compact design.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_9_MM_PARABELLUM, 'w_sb_smgmk2', [ItemType.WEAPON_SUB_MACHINE], 2.4);

// SMGs Chambered in 5.7x28mm
new WeaponItem('FN P90', 'A futuristic 5.7x28mm SMG with a high-capacity 50-round magazine.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_5_7_X28_MM, 'w_sb_assaultsmg', [ItemType.WEAPON_SUB_MACHINE], 3.0);
new WeaponItem('FN PS90', 'A civilian version of the P90, also chambered in 5.7x28mm.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_5_7_X28_MM, 'w_sb_assaultsmg', [ItemType.WEAPON_SUB_MACHINE], 2.9);
new WeaponItem('AR57', 'An AR-style SMG chambered in 5.7x28mm and compatible with P90 magazines.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_5_7_X28_MM, 'w_sb_pdw', [ItemType.WEAPON_SUB_MACHINE], 3.2);

// SMGs Chambered in .50 AE (Action Express)
new WeaponItem('IMI Desert Eagle Carbine/Conversion Kit', 'A unique SMG conversion of the Desert Eagle, chambered in .50 AE.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_50_AE, 'w_pi_pistolsmg_m31', [ItemType.WEAPON_SUB_MACHINE], 3.8);
new WeaponItem('Custom KRISS Vector', 'An experimental KRISS Vector chambered in .50 AE, known for recoil control.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_50_AE, 'w_pi_pistolsmg_m31', [ItemType.WEAPON_SUB_MACHINE], 3.5);
new WeaponItem('Custom Uzi .50 AE Conversion', 'A rare Uzi variant converted to fire .50 AE.', RageEnums.Hashes.Weapon.SMG, CaliberType.CALIBER_50_AE, 'w_sb_microsmg', [ItemType.WEAPON_SUB_MACHINE], 3.6);

// Assault Rifles Chambered in 5.56x45mm NATO
new WeaponItem('M16A4', 'Standard-issue assault rifle for many military forces.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_5_56_X45_MM_NATO, 'w_ar_carbinerifle_reh', [ItemType.WEAPON_ASSAULT_RIFLE], 3.9);
new WeaponItem('FN SCAR-L', 'A modular assault rifle chambered in 5.56 NATO.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_5_56_X45_MM_NATO, 'w_ar_heavyrifleh', [ItemType.WEAPON_ASSAULT_RIFLE], 4.0);
new WeaponItem('HK416', 'A highly reliable and accurate 5.56mm rifle used by special forces.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_5_56_X45_MM_NATO, 'w_ar_carbinerifle', [ItemType.WEAPON_ASSAULT_RIFLE], 4.2);
new WeaponItem('Steyr AUG A3', 'A bullpup rifle chambered in 5.56 NATO, known for its compact design.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_5_56_X45_MM_NATO, 'w_ar_advancedrifle', [ItemType.WEAPON_ASSAULT_RIFLE], 3.7);

// Assault Rifles Chambered in 7.62x51mm NATO
new WeaponItem('FN SCAR-H', 'A powerful battle rifle chambered in 7.62 NATO.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_7_62_X51_MM_NATO, 'w_ar_heavyrifleh', [ItemType.WEAPON_ASSAULT_RIFLE], 5.0);
new WeaponItem('M14', 'A semi-automatic rifle chambered in 7.62 NATO, used for long-range engagements.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_7_62_X51_MM_NATO, 'w_sl_battlerifle_m32', [ItemType.WEAPON_ASSAULT_RIFLE], 5.2);
new WeaponItem('HK G3', 'A versatile and reliable battle rifle chambered in 7.62 NATO.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_7_62_X51_MM_NATO, 'w_sl_battlerifle_m32', [ItemType.WEAPON_ASSAULT_RIFLE], 5.1);

// Assault Rifles Chambered in 7.62x39mm
new WeaponItem('AK-47', 'The legendary rifle known for durability and ease of use.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_7_62_X39_MM, 'w_ar_assaultrifle', [ItemType.WEAPON_ASSAULT_RIFLE], 4.3);
new WeaponItem('AKM', 'An improved version of the AK-47, chambered in 7.62x39mm.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_7_62_X39_MM, 'w_ar_assaultrifle', [ItemType.WEAPON_ASSAULT_RIFLE], 4.2);
new WeaponItem('SKS', 'A semi-automatic rifle chambered in 7.62x39mm, known for accuracy.', RageEnums.Hashes.Weapon.MARKSMANRIFLE, CaliberType.CALIBER_7_62_X39_MM, 'w_sr_marksmanrifle', [ItemType.WEAPON_ASSAULT_RIFLE], 4.4);

// Assault Rifles Chambered in .223 Remington
new WeaponItem('Ruger Mini-14', 'A lightweight semi-automatic rifle in .223 Remington.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_223_REMINGTON, 'w_sr_marksmanrifle', [ItemType.WEAPON_ASSAULT_RIFLE], 3.5);
new WeaponItem('Bushmaster XM15', 'An AR-15 variant chambered in .223 Remington.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_223_REMINGTON, 'w_ar_carbinerifle_reh', [ItemType.WEAPON_ASSAULT_RIFLE], 3.8);

// Assault Rifles Chambered in .300 Blackout
new WeaponItem('AAC Honey Badger', 'A compact assault rifle optimized for .300 Blackout.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_300_BLACKOUT, 'w_ar_honeybadger', [ItemType.WEAPON_ASSAULT_RIFLE], 3.9);
new WeaponItem('SIG MCX', 'A versatile rifle chambered in .300 Blackout, suitable for CQB.', RageEnums.Hashes.Weapon.CARBINERIFLE_MK2, CaliberType.CALIBER_300_BLACKOUT, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.0);
new WeaponItem('Daniel Defense DDM4', 'A reliable AR-platform rifle chambered in .300 Blackout.', RageEnums.Hashes.Weapon.CARBINERIFLE_MK2, CaliberType.CALIBER_300_BLACKOUT, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.1);

// Assault Rifles Chambered in 5.45x39mm
new WeaponItem('AK-74', 'An upgraded AK variant chambered in 5.45x39mm for reduced recoil.', RageEnums.Hashes.Weapon.ASSAULTRIFLE_MK2, CaliberType.CALIBER_5_45_X39_MM, 'w_ar_assaultriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.0);
new WeaponItem('RPK-74', 'A squad support variant of the AK-74, chambered in 5.45x39mm.', RageEnums.Hashes.Weapon.ASSAULTRIFLE_MK2, CaliberType.CALIBER_5_45_X39_MM, 'w_ar_assaultriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 5.0);

// Assault Rifles Chambered in .204 Ruger
new WeaponItem('AR-15 .204 Ruger', 'A custom AR-15 optimized for high-velocity .204 Ruger rounds.', RageEnums.Hashes.Weapon.CARBINERIFLE_MK2, CaliberType.CALIBER_204_RUGER, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 3.7);
new WeaponItem('Savage MSR 15', 'A lightweight semi-auto rifle chambered in .204 Ruger.', RageEnums.Hashes.Weapon.CARBINERIFLE_MK2, CaliberType.CALIBER_204_RUGER, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 3.6);

// Assault Rifles Chambered in .277 Fury
new WeaponItem('SIG MCX Spear', 'A modular rifle chambered in .277 Fury, designed for maximum power.', RageEnums.Hashes.Weapon.CARBINERIFLE_MK2, CaliberType.CALIBER_277_FURY, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.5);
new WeaponItem('SIG Cross', 'A lightweight bolt-action rifle chambered in .277 Fury.', RageEnums.Hashes.Weapon.CARBINERIFLE_MK2, CaliberType.CALIBER_277_FURY, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.4);

// Assault Rifles Chambered in 6.5 Grendel
new WeaponItem('Alexander Arms 6.5 Grendel AR-15', 'A powerful AR-15 variant chambered in 6.5 Grendel.', RageEnums.Hashes.Weapon.CARBINERIFLE_MK2, CaliberType.CALIBER_6_5_GRENDEL, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.3);
new WeaponItem('Howa 1500 Mini Action', 'A bolt-action rifle chambered in 6.5 Grendel.', RageEnums.Hashes.Weapon.PRECISIONRIFLE, CaliberType.CALIBER_6_5_GRENDEL, 'w_sr_precisionrifle_reh', [ItemType.WEAPON_ASSAULT_RIFLE], 4.2);


new AmmoItem('.22 LR', 'Ammunition for .22 caliber pistols and rifles.', CaliberType.CALIBER_22_LR, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.3);
new AmmoItem('.25 ACP', 'Ammunition for .25 caliber pocket pistols.', CaliberType.CALIBER_25_ACP, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.35);
new AmmoItem('.32 ACP', 'Ammunition for .32 caliber pistols.', CaliberType.CALIBER_32_ACP, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.4);
new AmmoItem('.380 ACP', 'Ammunition for .380 caliber pistols.', CaliberType.CALIBER_380_ACP, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.45);
new AmmoItem('9mm', 'Ammunition for 9mm pistols and submachine guns.', CaliberType.CALIBER_9_MM, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.5);
new AmmoItem('.38 Special', 'Ammunition for .38 caliber revolvers.', CaliberType.CALIBER_38_SPECIAL, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.55);
new AmmoItem('.40 S&W', 'Ammunition for .40 caliber pistols.', CaliberType.CALIBER_40_S_W, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.6);
new AmmoItem('.44 Special', 'Ammunition for .44 caliber revolvers.', CaliberType.CALIBER_44_SPECIAL, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.65);
new AmmoItem('.357 Magnum', 'Ammunition for .357 caliber revolvers.', CaliberType.CALIBER_357_MAGNUM, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.7);
new AmmoItem('.45 ACP', 'Ammunition for .45 caliber pistols and submachine guns.', CaliberType.CALIBER_45_ACP, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.75);
new AmmoItem('.44 Magnum', 'Ammunition for .44 caliber revolvers.', CaliberType.CALIBER_44_MAGNUM, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.8);
new AmmoItem('.45 Colt', 'Ammunition for .45 Colt revolvers.', CaliberType.CALIBER_45_COLT, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.85);
new AmmoItem('10mm Auto', 'Ammunition for 10mm pistols.', CaliberType.CALIBER_10MM_AUTO, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.9);
new AmmoItem('.357 SIG', 'Ammunition for .357 SIG pistols.', CaliberType.CALIBER_357_SIG, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 0.95);
new AmmoItem('.45 GAP', 'Ammunition for .45 GAP pistols.', CaliberType.CALIBER_45_GAP, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 1.0);
new AmmoItem('.500 S&W', 'Ammunition for .500 caliber revolvers.', CaliberType.CALIBER_500_S_W, 'w_pi_vintage_pistol_mag1', [ItemType.AMMUNITION], 1.1);

new AmmoItem('5.56mm', 'Ammunition for AR-15 and similar rifles.', CaliberType.CALIBER_5_56_MM, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 1.2);
new AmmoItem('7.62mm', 'Ammunition for battle rifles and snipers.', CaliberType.CALIBER_7_62_MM, 'w_sr_heavysniper_mag1', [ItemType.AMMUNITION], 1.3);
new AmmoItem('.308 Winchester', 'Ammunition for hunting and military rifles.', CaliberType.CALIBER_308_WINCHESTER, 'w_sr_sniperrifle_mag1', [ItemType.AMMUNITION], 1.4);
new AmmoItem('.300 Blackout', 'Ammunition for suppressed and short-barreled rifles.', CaliberType.CALIBER_300_BLACKOUT, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 1.5);
new AmmoItem('.223 Remington', 'Ammunition for AR-15 rifles.', CaliberType.CALIBER_223_REMINGTON, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 1.2);
new AmmoItem('5.45x39mm', 'Ammunition for AK-74 rifles.', CaliberType.CALIBER_5_45_X39_MM, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 1.2);
new AmmoItem('.277 Fury', 'Ammunition for next-generation military rifles.', CaliberType.CALIBER_277_FURY, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 1.3);
new AmmoItem('6.5 Grendel', 'Ammunition for precision rifles.', CaliberType.CALIBER_6_5_GRENDEL, 'w_sr_heavysniper_mag1', [ItemType.AMMUNITION], 1.3);
new AmmoItem('.204 Ruger', 'Ammunition for high-velocity rifles.', CaliberType.CALIBER_204_RUGER, 'w_sr_heavysniper_mag1', [ItemType.AMMUNITION], 1.1);

new AmmoItem('12 Gauge', 'Shotgun shells for 12 gauge shotguns.', CaliberType.CALIBER_12_GAUGE, 'w_sg_assaultshotgun_mag1', [ItemType.AMMUNITION], 1.8);
new AmmoItem('10 Gauge', 'Shotgun shells for 10 gauge shotguns.', CaliberType.CALIBER_10_GAUGE, 'w_sg_assaultshotgun_mag1', [ItemType.AMMUNITION], 2.0);

new AmmoItem('.50 BMG', 'Ammunition for heavy machine guns and anti-materiel rifles.', CaliberType.CALIBER_50_BMG, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 2.5);
new AmmoItem('.338 Lapua', 'Ammunition for long-range sniper rifles.', CaliberType.CALIBER_338_LAPUA, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 2.2);

new AmmoItem('40mm Grenade', 'Explosive grenade rounds for grenade launchers.', CaliberType.CALIBER_40MM_GRENADE, 'w_sg_assaultshotgun_mag1', [ItemType.AMMUNITION], 3.0);
new AmmoItem('RPG', 'Rocket-propelled grenade rounds.', CaliberType.CALIBER_RPG, 'w_lr_rpg_rocket', [ItemType.AMMUNITION], 5.0);

new AmmoItem('Flare', 'Signal flares used for illumination or signaling.', CaliberType.CALIBER_FLARE, 'hei_prop_heist_deposit_box', [ItemType.AMMUNITION], 0.8);
new AmmoItem('Paintball', 'Non-lethal paintball rounds.', CaliberType.CALIBER_PAINTBALL, 'w_ar_bullpuprifle_mag2', [ItemType.AMMUNITION], 0.5);
new AmmoItem('.50 AE', 'Ammunition for Desert Eagle and similar handguns.', CaliberType.CALIBER_50_AE, 'w_pi_appistol_mag1', [ItemType.AMMUNITION], 1.2);
new AmmoItem('9mm Parabellum', 'Standard 9mm NATO ammunition.', CaliberType.CALIBER_9_MM_PARABELLUM, 'w_pi_appistol_mag1', [ItemType.AMMUNITION], 0.55);
new AmmoItem('5.7x28mm', 'Ammunition for FN P90 and Five-seveN pistols.', CaliberType.CALIBER_5_7_X28_MM, 'w_pi_appistol_mag2', [ItemType.AMMUNITION], 0.7);
new AmmoItem('5.56x45mm NATO', 'Military-grade rifle ammunition.', CaliberType.CALIBER_5_56_X45_MM_NATO, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 1.2);
new AmmoItem('7.62x51mm NATO', 'Ammunition for battle rifles.', CaliberType.CALIBER_7_62_X51_MM_NATO, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 1.4);
new AmmoItem('7.62x39mm', 'Ammunition for AK-47 rifles.', CaliberType.CALIBER_7_62_X39_MM, 'w_ar_bullpuprifle_mag1', [ItemType.AMMUNITION], 1.3);

new BankCardItem('items.credit_card', 'items.credit_card_description', 'prop_cs_credit_card', [], 0.1);
new LicenseItem('items.driving_license', 'items.driving_license_description', 'prop_cs_license', [ItemType.DRIVING_LICENSE], 0.1);

new WearableItem('items.wearable_undershirt', 'items.wearable_undershirt_description', RageEnums.ClothesComponent.ACCESSORIES_1, 'prop_ld_tshirt_02', [ItemType.PRODUCT_CLOTHING_STORE], 0.3);
new WearableItem('items.wearable_top', 'items.wearable_top_description', RageEnums.ClothesComponent.DECALS, 'prop_ld_tshirt_02', [ItemType.PRODUCT_CLOTHING_STORE], 0.4);
new WearableItem('items.wearable_bottom', 'items.wearable_bottom_description', RageEnums.ClothesComponent.LEGS, 'prop_ld_jeans_01', [ItemType.PRODUCT_CLOTHING_STORE], 0.4);
new WearableItem('items.wearable_footwear', 'items.wearable_footwear_description', RageEnums.ClothesComponent.SHOES, 'prop_ld_shoe_01', [ItemType.PRODUCT_CLOTHING_STORE], 0.5);
new WearableItem('items.wearable_mask', 'items.wearable_mask_description', 1, 'prop_mask_bugstar', [ItemType.PRODUCT_CLOTHING_STORE], 0.3);
new ArmourItem('items.equipment_kevlar_standard', 'items.equipment_kevlar_standard_description', 'prop_bodyarmour_03', 100, 1.75);
new ArmourItem('items.equipment_kevlar_heavy', 'items.equipment_kevlar_heavy_description', 'prop_bodyarmour_03', 200, 2.25);


new HandheldRadioItemModel('items.handheld_radio', 'items.handheld_radio_description', 'prop_cs_hand_radio', [], 0.25);
new SmartphoneItemModel('items.smartphone', 'items.smartphone_description', 'prop_amb_phone', [], 0.3);


new FishingRodItem('items.fishing_rod', 'items.fishing_rod_description', 'prop_fishing_rod_01', 1.5);
new FishingRodItem('items.fishing_rod_02', 'items.fishing_rod_description', 'prop_fishing_rod_02', 1.5);

new MiscellaneousItem('items.fishing_bait', 'items.fishing_bait_description', 'prop_paints_can01', [ItemType.FISHING_BAIT], 0.3);

new CuffItem();

new DrugItem('Marijuana', 'Cannabis flower', AddictionType.Cannabis, 'prop_marijuana', 0.001, {
  intensity: 0.5,
  duration: 30,
  effects: [
    { type: 'health_regen', amount: 10, interval: 60, duration: 300 },
    { type: 'addiction', amount: 0.2 }
  ]
});

new DrugItem('Cocaine', 'Powder cocaine', AddictionType.Cocaine, 'prop_cocaine', 0.001, {
  intensity: 1.0,
  duration: 18,
  effects: [
    { type: 'strength', amount: 10 },
    { type: 'health_regen', amount: 15, interval: 30, duration: 180 },
    { type: 'addiction', amount: 1.2 }
  ]
});

new DrugItem('Crack Cocaine', 'Crack rocks', AddictionType.Crack, 'prop_crack', 0.001, {
  intensity: 1.2,
  duration: 12,
  effects: [
    { type: 'strength', amount: 12 },
    { type: 'health', amount: 10 },
    { type: 'addiction', amount: 1.6 }
  ]
});

new DrugItem('Ecstasy', 'MDMA pill', AddictionType.Ecstasy, 'prop_ecstasy', 0.0002, {
  intensity: 0.9,
  duration: 60,
  effects: [
    { type: 'stamina', amount: 20 },
    { type: 'health_regen', amount: 20, interval: 60, duration: 600 },
    { type: 'addiction', amount: 0.8 }
  ]
});

new DrugItem('Heroin', 'Heroin powder', AddictionType.Heroin, 'prop_heroin', 0.001, {
  intensity: 1.3,
  duration: 60,
  effects: [
    { type: 'health', amount: 25 },
    { type: 'health_regen', amount: 25, interval: 120, duration: 600 },
    { type: 'addiction', amount: 1.8 }
  ]
});

new DrugItem('Methamphetamine', 'Meth crystals', AddictionType.Meth, 'prop_meth', 0.001, {
  intensity: 1.4,
  duration: 48,
  effects: [
    { type: 'strength', amount: 15 },
    { type: 'stamina', amount: 40 },
    { type: 'addiction', amount: 2.1 }
  ]
});

new DrugItem('Morphine', 'Morphine pill', AddictionType.Morphine, 'prop_morphine', 0.0003, {
  intensity: 0.8,
  duration: 30,
  effects: [
    { type: 'health', amount: 20 },
    { type: 'health_regen', amount: 10, interval: 45, duration: 300 },
    { type: 'addiction', amount: 1.0 }
  ]
});

new DrugItem('Steroids', 'Dianabol pill', AddictionType.Dianabol, 'prop_steroids', 0.00001, {
  intensity: 0.4,
  duration: 72,
  effects: [
    { type: 'strength', amount: 8 },
    { type: 'stamina', amount: 25 },
    { type: 'addiction', amount: 0.6 }
  ]
});

new DrugItem('LSD Acid', 'LSD blotter', AddictionType.Acid, 'prop_lsd', 0.000001, {
  intensity: 0.3,
  duration: 90,
  effects: [
    { type: 'health', amount: 5 },
    { type: 'addiction', amount: 0.2 }
  ]
});

new DrugItem('Shrooms', 'Magic mushrooms', AddictionType.Shrooms, 'prop_shrooms', 0.001, {
  intensity: 0.4,
  duration: 90,
  effects: [
    { type: 'health_regen', amount: 5, interval: 60, duration: 900 },
    { type: 'addiction', amount: 0.3 }
  ]
});

new DrugItem('PCP', 'PCP powder', AddictionType.PCP, 'prop_pcp', 0.001, {
  intensity: 1.5,
  duration: 30,
  effects: [
    { type: 'strength', amount: 18 },
    { type: 'health', amount: 15 },
    { type: 'addiction', amount: 1.7 }
  ]
});

new FoodItem(
  'items.fish_bass',
  'items.fish_bass_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.5,
  {
    calories: 40, // Raw values (will be better when cooked)
    hydration: 5,
    requiresCooking: false, // Can be eaten raw but better cooked
    cookingTime: 90000 // 1.5 minutes
  }
);

new FoodItem(
  'items.fish_perch',
  'items.fish_perch_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.4,
  {
    calories: 35,
    hydration: 5,
    requiresCooking: false,
    cookingTime: 80000
  }
);

new FoodItem(
  'items.fish_pike',
  'items.fish_pike_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.7,
  {
    calories: 50,
    hydration: 5,
    requiresCooking: false,
    cookingTime: 120000 // 2 minutes
  }
);

// === PREMIUM FISH (Better nutrition) ===

new FoodItem(
  'items.fish_salmon',
  'items.fish_salmon_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.8,
  {
    calories: 60, // High quality fish
    hydration: 8,
    requiresCooking: false, // Perfect for sushi
    cookingTime: 100000
  }
);

new FoodItem(
  'items.fish_trout',
  'items.fish_trout_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.6,
  {
    calories: 45,
    hydration: 6,
    requiresCooking: false,
    cookingTime: 90000
  }
);

new FoodItem(
  'items.fish_tuna',
  'items.fish_tuna_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  1.2,
  {
    calories: 70, // Large, nutritious fish
    hydration: 5,
    requiresCooking: false,
    cookingTime: 150000 // 2.5 minutes
  }
);

// === RARE/EXOTIC FISH ===

new FoodItem(
  'items.fish_swordfish',
  'items.fish_swordfish_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  2.0,
  {
    calories: 80,
    hydration: 5,
    requiresCooking: false,
    cookingTime: 180000 // 3 minutes
  }
);

new FoodItem(
  'items.fish_marlin',
  'items.fish_marlin_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  2.5,
  {
    calories: 85,
    hydration: 5,
    requiresCooking: false,
    cookingTime: 200000
  }
);

// === SMALL/BAIT FISH ===

new FoodItem(
  'items.fish_sardine',
  'items.fish_sardine_description',
  [ItemType.FISH, ItemType.FISHING_BAIT],
  'bzzz_animal_fish002',
  0.1,
  {
    calories: 15,
    hydration: 3,
    requiresCooking: false,
    cookingTime: 40000
  }
);

new FoodItem(
  'items.fish_anchovy',
  'items.fish_anchovy_description',
  [ItemType.FISH, ItemType.FISHING_BAIT],
  'bzzz_animal_fish002',
  0.08,
  {
    calories: 12,
    hydration: 3,
    requiresCooking: false,
    cookingTime: 30000
  }
);

new FoodItem(
  'items.fish_mackerel',
  'items.fish_mackerel_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.5,
  {
    calories: 40,
    hydration: 5,
    requiresCooking: false,
    cookingTime: 85000
  }
);

// === SHELLFISH/SEAFOOD ===

new FoodItem(
  'items.seafood_crab',
  'items.seafood_crab_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.4,
  {
    calories: 35,
    hydration: 8,
    requiresCooking: true, // Shellfish should be cooked
    cookingTime: 120000
  }
);

new FoodItem(
  'items.seafood_lobster',
  'items.seafood_lobster_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.8,
  {
    calories: 50,
    hydration: 10,
    requiresCooking: true,
    cookingTime: 180000
  }
);

new FoodItem(
  'items.seafood_shrimp',
  'items.seafood_shrimp_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.2,
  {
    calories: 25,
    hydration: 6,
    requiresCooking: true,
    cookingTime: 60000 // 1 minute
  }
);

// === FRESHWATER VARIETIES ===

new FoodItem(
  'items.fish_catfish',
  'items.fish_catfish_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.9,
  {
    calories: 55,
    hydration: 5,
    requiresCooking: false,
    cookingTime: 110000
  }
);

new FoodItem(
  'items.fish_carp',
  'items.fish_carp_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  1.0,
  {
    calories: 48,
    hydration: 5,
    requiresCooking: false,
    cookingTime: 120000
  }
);
new FoodItem(
  'items.fish_eel',
  'items.fish_eel_description',
  [ItemType.FISH],
  'bzzz_animal_fish002',
  0.6,
  {
    calories: 42,
    hydration: 6,
    requiresCooking: false,
    cookingTime: 100000
  }
);


