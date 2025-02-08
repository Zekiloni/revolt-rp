import { WeaponItem } from './weapon-item.model';
import { CaliberType, ItemType, PlayerAttachmentTypeEnum } from '@revolt-rp/common';
import { DrinkItemModel } from './drink-item.model';
import { AmmoItem } from './ammo-item.model';
import { BankCardItem } from './bank-card-item.model';
import { WearableItem } from './clothing/wearable-item.model';
import { ArmourItem } from './equipment/armour-item.model';

new DrinkItemModel('Water Bottle', 'Flow water bottle, contains 0.3l of pure taste of water.', [], 'prop_ld_flow_bottle', 0.3, 0, PlayerAttachmentTypeEnum.HoldLdFlowBottle);
new DrinkItemModel('Beer Bottle', 'Pißwasser beer bottle, contains 0.3l of best German beer.', [ItemType.BEVERAGE], 'prop_amb_beer_bottle', 0.3, 4, PlayerAttachmentTypeEnum.HoldAmbBeerBottle);


new WeaponItem('Ruger Mark IV', 'A popular semi-automatic target pistol.', RageEnums.Hashes.Weapon.PISTOL, CaliberType.CALIBER_22_LR, 'w_pi_pistol', [ItemType.WEAPON_PISTOL], 0.5);
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
new WeaponItem('SKS', 'A semi-automatic rifle chambered in 7.62x39mm, known for accuracy.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_7_62_X39_MM, 'w_sr_marksmanrifle', [ItemType.WEAPON_ASSAULT_RIFLE], 4.4);

// Assault Rifles Chambered in .223 Remington
new WeaponItem('Ruger Mini-14', 'A lightweight semi-automatic rifle in .223 Remington.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_223_REMINGTON, 'w_sr_marksmanrifle', [ItemType.WEAPON_ASSAULT_RIFLE], 3.5);
new WeaponItem('Bushmaster XM15', 'An AR-15 variant chambered in .223 Remington.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_223_REMINGTON, 'w_ar_carbinerifle_reh', [ItemType.WEAPON_ASSAULT_RIFLE], 3.8);

// Assault Rifles Chambered in .300 Blackout
new WeaponItem('AAC Honey Badger', 'A compact assault rifle optimized for .300 Blackout.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_300_BLACKOUT, 'w_ar_honeybadger', [ItemType.WEAPON_ASSAULT_RIFLE], 3.9);
new WeaponItem('SIG MCX', 'A versatile rifle chambered in .300 Blackout, suitable for CQB.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_300_BLACKOUT, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.0);
new WeaponItem('Daniel Defense DDM4', 'A reliable AR-platform rifle chambered in .300 Blackout.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_300_BLACKOUT, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.1);

// Assault Rifles Chambered in 5.45x39mm
new WeaponItem('AK-74', 'An upgraded AK variant chambered in 5.45x39mm for reduced recoil.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_5_45_X39_MM, 'w_ar_assaultriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.0);
new WeaponItem('RPK-74', 'A squad support variant of the AK-74, chambered in 5.45x39mm.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_5_45_X39_MM, 'w_ar_assaultriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 5.0);

// Assault Rifles Chambered in .204 Ruger
new WeaponItem('AR-15 .204 Ruger', 'A custom AR-15 optimized for high-velocity .204 Ruger rounds.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_204_RUGER, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 3.7);
new WeaponItem('Savage MSR 15', 'A lightweight semi-auto rifle chambered in .204 Ruger.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_204_RUGER, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 3.6);

// Assault Rifles Chambered in .277 Fury
new WeaponItem('SIG MCX Spear', 'A modular rifle chambered in .277 Fury, designed for maximum power.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_277_FURY, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.5);
new WeaponItem('SIG Cross', 'A lightweight bolt-action rifle chambered in .277 Fury.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_277_FURY, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.4);

// Assault Rifles Chambered in 6.5 Grendel
new WeaponItem('Alexander Arms 6.5 Grendel AR-15', 'A powerful AR-15 variant chambered in 6.5 Grendel.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_6_5_GRENDEL, 'w_ar_carbineriflemk2', [ItemType.WEAPON_ASSAULT_RIFLE], 4.3);
new WeaponItem('Howa 1500 Mini Action', 'A bolt-action rifle chambered in 6.5 Grendel.', RageEnums.Hashes.Weapon.ASSAULTRIFLE, CaliberType.CALIBER_6_5_GRENDEL, 'w_sr_precisionrifle_reh', [ItemType.WEAPON_ASSAULT_RIFLE], 4.2);


new AmmoItem('.22 LR Cartridge', 'A small and lightweight .22 caliber round.', CaliberType.CALIBER_22_LR, 'w_pi_pistol_mag1', [ItemType.AMMUNITION], 0.35);


new BankCardItem('items.credit_card', 'items.credit_card_description', 'prop_cs_credit_card', [], 0.1);

new WearableItem('items.wearable_undershirt', 'items.wearable_undershirt_description', RageEnums.ClothesComponent.ACCESSORIES_1, 'prop_ld_tshirt_02', [], 0.3);
new WearableItem('items.wearable_top', 'items.wearable_top_description', RageEnums.ClothesComponent.DECALS, 'prop_ld_tshirt_02', [], 0.4)
new WearableItem('items.wearable_bottom', 'items.wearable_bottom_description', RageEnums.ClothesComponent.LEGS, 'prop_ld_jeans_01', [], 0.4);
new WearableItem('items.wearable_footwear', 'items.wearable_footwear_description', RageEnums.ClothesComponent.FOOT, 'prop_ld_shoe_01', [], 0.5);
new WearableItem('items.wearable_mask', 'items.wearable_mask_description', RageEnums.ClothesComponent.MASK, 'prop_mask_bugstar', [], 0.3);
new ArmourItem('items.equipment_kevlar_standard', 'items.equipment_kevlar_standard_description', 'prop_bodyarmour_03', 100, 1.75);
new ArmourItem('items.equipment_kevlar_heavy', 'items.equipment_kevlar_heavy_description', 'prop_bodyarmour_03', 200, 2.25);
