export interface WeaponRecoilConfig {
  recoil: number;
  shake: number;
}

export const weaponRecoilConfig: Record<number, WeaponRecoilConfig> = {
  [mp.game.joaat("WEAPON_PISTOL")]: { recoil: 0.3, shake: 0.06 },
  [mp.game.joaat("WEAPON_PISTOL_MK2")]: { recoil: 0.3, shake: 0.03 },
  [mp.game.joaat("WEAPON_COMBATPISTOL")]: { recoil: 0.2, shake: 0.03 },
  [mp.game.joaat("WEAPON_APPISTOL")]: { recoil: 0.1, shake: 0.05 },
  [mp.game.joaat("WEAPON_PISTOL50")]: { recoil: 0.6, shake: 0.05 },

  // SMGs
  [mp.game.joaat("WEAPON_MICROSMG")]: { recoil: 0.2, shake: 0.035 },
  [mp.game.joaat("WEAPON_SMG")]: { recoil: 0.1, shake: 0.045 },
  [mp.game.joaat("WEAPON_SMG_MK2")]: { recoil: 0.1, shake: 0.055 },
  [mp.game.joaat("WEAPON_ASSAULTSMG")]: { recoil: 0.1, shake: 0.050 },

  // Rifles
  [mp.game.joaat("WEAPON_ASSAULTRIFLE")]: { recoil: 0.2, shake: 0.07 },
  [mp.game.joaat("WEAPON_ASSAULTRIFLE_MK2")]: { recoil: 0.2, shake: 0.072 },
  [mp.game.joaat("WEAPON_CARBINERIFLE")]: { recoil: 0.1, shake: 0.06 },
  [mp.game.joaat("WEAPON_CARBINERIFLE_MK2")]: { recoil: 0.1, shake: 0.065 },
  [mp.game.joaat("WEAPON_ADVANCEDRIFLE")]: { recoil: 0.1, shake: 0.06 },

  // LMG
  [mp.game.joaat("WEAPON_MG")]: { recoil: 0.1, shake: 0.07 },
  [mp.game.joaat("WEAPON_COMBATMG")]: { recoil: 0.1, shake: 0.08 },
  [mp.game.joaat("WEAPON_COMBATMG_MK2")]: { recoil: 0.1, shake: 0.085 },

  // Shotguns
  [mp.game.joaat("WEAPON_PUMPSHOTGUN")]: { recoil: 0.4, shake: 0.07 },
  [mp.game.joaat("WEAPON_PUMPSHOTGUN_MK2")]: { recoil: 0.4, shake: 0.085 },
  [mp.game.joaat("WEAPON_SAWNOFFSHOTGUN")]: { recoil: 0.7, shake: 0.06 },
  [mp.game.joaat("WEAPON_ASSAULTSHOTGUN")]: { recoil: 0.4, shake: 0.12 },
  [mp.game.joaat("WEAPON_BULLPUPSHOTGUN")]: { recoil: 0.2, shake: 0.08 },

  // Misc
  [mp.game.joaat("WEAPON_STUNGUN")]: { recoil: 0.1, shake: 0.01 },

  // Snipers
  [mp.game.joaat("WEAPON_SNIPERRIFLE")]: { recoil: 0.5, shake: 0.2 },
  [mp.game.joaat("WEAPON_HEAVYSNIPER")]: { recoil: 0.7, shake: 0.3 },
  [mp.game.joaat("WEAPON_HEAVYSNIPER_MK2")]: { recoil: 0.7, shake: 0.35 },
  [mp.game.joaat("WEAPON_REMOTESNIPER")]: { recoil: 1.2, shake: 0.1 },

  // Launchers
  [mp.game.joaat("WEAPON_GRENADELAUNCHER")]: { recoil: 1.0, shake: 0.08 },
  [mp.game.joaat("WEAPON_GRENADELAUNCHER_SMOKE")]: { recoil: 1.0, shake: 0.04 }, // FIXED
  [mp.game.joaat("WEAPON_RPG")]: { recoil: 0.0, shake: 0.9 },
  [mp.game.joaat("WEAPON_STINGER")]: { recoil: 0.0, shake: 0.3 },
  [mp.game.joaat("WEAPON_MINIGUN")]: { recoil: 0.01, shake: 0.25 },

  // Pistols II
  [mp.game.joaat("WEAPON_SNSPISTOL")]: { recoil: 0.2, shake: 0.02 },
  [mp.game.joaat("WEAPON_SNSPISTOL_MK2")]: { recoil: 0.25, shake: 0.025 },

  // SMG / LMG
  [mp.game.joaat("WEAPON_GUSENBERG")]: { recoil: 0.1, shake: 0.05 },

  // Rifles II
  [mp.game.joaat("WEAPON_SPECIALCARBINE")]: { recoil: 0.2, shake: 0.06 },
  [mp.game.joaat("WEAPON_SPECIALCARBINE_MK2")]: { recoil: 0.25, shake: 0.075 },

  // Pistols III
  [mp.game.joaat("WEAPON_HEAVYPISTOL")]: { recoil: 0.4, shake: 0.04 },

  // Rifles III
  [mp.game.joaat("WEAPON_BULLPUPRIFLE")]: { recoil: 0.2, shake: 0.05 },
  [mp.game.joaat("WEAPON_BULLPUPRIFLE_MK2")]: { recoil: 0.25, shake: 0.055 },

  // Pistols IV
  [mp.game.joaat("WEAPON_VINTAGEPISTOL")]: { recoil: 0.4, shake: 0.025 },
  [mp.game.joaat("WEAPON_DOUBLEACTION")]: { recoil: 0.4, shake: 0.025 },

  // Rifles / Shotguns / Snipers
  [mp.game.joaat("WEAPON_MUSKET")]: { recoil: 0.7, shake: 0.09 },
  [mp.game.joaat("WEAPON_HEAVYSHOTGUN")]: { recoil: 0.2, shake: 0.13 },
  [mp.game.joaat("WEAPON_MARKSMANRIFLE")]: { recoil: 0.3, shake: 0.05 },
  [mp.game.joaat("WEAPON_MARKSMANRIFLE_MK2")]: { recoil: 0.35, shake: 0.035 },

  // Launchers II
  [mp.game.joaat("WEAPON_HOMINGLAUNCHER")]: { recoil: 0, shake: 0.04 },

  // Misc II
  [mp.game.joaat("WEAPON_FLAREGUN")]: { recoil: 0.9, shake: 0.04 },

  // PDW
  [mp.game.joaat("WEAPON_COMBATPDW")]: { recoil: 0.2, shake: 0.05 },

  // Pistol V
  [mp.game.joaat("WEAPON_MARKSMANPISTOL")]: { recoil: 0.9, shake: 0.04 },

  // Railgun
  [mp.game.joaat("WEAPON_RAILGUN")]: { recoil: 2.4, shake: 0.08 },

  // SMG / Pistols VI
  [mp.game.joaat("WEAPON_MACHINEPISTOL")]: { recoil: 0.3, shake: 0.04 },

  // Revolvers
  [mp.game.joaat("WEAPON_REVOLVER")]: { recoil: 0.6, shake: 0.05 },
  [mp.game.joaat("WEAPON_REVOLVER_MK2")]: { recoil: 0.65, shake: 0.055 },

  // Shotgun II
  [mp.game.joaat("WEAPON_DBSHOTGUN")]: { recoil: 0.7, shake: 0.04 },

  // Rifles IV
  [mp.game.joaat("WEAPON_COMPACTRIFLE")]: { recoil: 0.3, shake: 0.03 },

  // Shotgun III
  [mp.game.joaat("WEAPON_AUTOSHOTGUN")]: { recoil: 0.2, shake: 0.04 },

  // Launcher III
  [mp.game.joaat("WEAPON_COMPACTLAUNCHER")]: { recoil: 0.5, shake: 0.05 },

  // SMG II
  [mp.game.joaat("WEAPON_MINISMG")]: { recoil: 0.1, shake: 0.03 },
};
