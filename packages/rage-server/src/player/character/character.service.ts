import { triggerBrowsers, triggerClient } from '@libertymp/rage-rpc';
import {
  BankAccountType,
  CharacterGender,
  CharacterSpawnType, defaultOutfits,
  HeadOverlayComponent,
  headOverlays as headOverlayInfo,
  ICharacterCreate,
  PlayerSharedDataType,
  ProcedureKey
} from '@revolt-rp/common';
import { characterConfig } from './character.config';
import { createBankAccount, createBankCardItem } from '../../banking/banking.service';
import { loadPlayerClothing } from '../inventory/player-clothing.service';
import { getWearableItemByComponent } from '../../item/registry/clothing/clothing.util';
import { playerGiveItem } from '../inventory/player-inventory.service';
import { clearPlayerDamages } from '../damage/player-damage.service';
import { Organization } from '../../organization/organization.model';
import { Character } from './character.model';
import { OrganizationRank } from '../../organization/rank/organization-rank.model';
import { UpdateQuery } from 'mongoose';
import { CharacterModel } from '../../common/entity-ref';
import { Property } from '../../property/property.model';

export const createCharacter = async (player: PlayerMp, characterCreate: ICharacterCreate) => {
  try {
    const character = await CharacterModel.create({
      ...characterCreate,
      cash: characterConfig.defaultCash,
      account: player.account.id
    });

    player.account.characters.push(character);
    await player.account.save();

    return character;
  } catch (e) {
    return e;
  }
};

export const getCharacterById = (characterId: string): Promise<Character | null> => {
  return CharacterModel.findById(characterId)
    .populate('membership')
    .exec();
};


export const updateCharacter = (characterId: string, update: UpdateQuery<Character>): Promise<Character | null> => {
  return CharacterModel.findByIdAndUpdate(characterId, update, { new: true }).exec();
};

export async function giveMoney(player: PlayerMp, amount: number) {
  player.character.cash += amount;
  await player.character.save();
  player.setVariable(PlayerSharedDataType.Cash, player.character.cash);
}

export async function setMoney(player: PlayerMp, amount: number) {
  player.character.cash = amount;
  await player.character.save();
  player.setVariable(PlayerSharedDataType.Cash, player.character.cash);
}


const loadPlayerVariables = (player: PlayerMp) => {
  player.setVariables({
    [PlayerSharedDataType.Username]: player.account.username,
    [PlayerSharedDataType.CharacterId]: player.character.id,
    [PlayerSharedDataType.IsSpawned]: true,
    [PlayerSharedDataType.Cash]: player.character.cash,
    [PlayerSharedDataType.IsWounded]: player.character.isWounded,
    [PlayerSharedDataType.Administrator]: player.account.administrator,
    [PlayerSharedDataType.TextBubble]: null,
    [PlayerSharedDataType.SelectedItemId]: null,
    [PlayerSharedDataType.Frozen]: false,
    [PlayerSharedDataType.IsRestrained]: player.character.isRestrained,
    [PlayerSharedDataType.Offer]: null,
    [PlayerSharedDataType.WalkingStyle]: 'normal',
    [PlayerSharedDataType.Attachments]: [],
    [PlayerSharedDataType.PhoneState]: null,
    [PlayerSharedDataType.AdminDuty]: false,
    [PlayerSharedDataType.Work]: null,
    [PlayerSharedDataType.Seatbelt]: false,
    [PlayerSharedDataType.Afk]: false,
    [PlayerSharedDataType.Job]: player.character.job ? player.character.job.jobKey : null,
    [PlayerSharedDataType.Organization]: player.character.membership ? player.character.membership.organization : null
  });
};

const loadCharacterAppearance = (player: PlayerMp) => {
  player.model = player.character.gender == CharacterGender.FEMALE ?
    RageEnums.Hashes.Ped.MP_F_FREEMODE_01 : RageEnums.Hashes.Ped.MP_M_FREEMODE_01;

  const {
    headBlendData,
    hairStyle,
    hairColor,
    hairHighlightColor,
    beardStyle,
    beardColor,
    beardOpacity,
    headOverlays,
    faceFeature
  } = player.character.appearance;

  player.setHeadBlend(
    headBlendData.shapeFirstId,
    headBlendData.shapeSecondId,
    0,
    headBlendData.skinFirstId,
    headBlendData.skinSecondId,
    0,
    headBlendData.shapeMix,
    headBlendData.skinMix,
    0
  );

  player.setClothes(RageEnums.ClothesComponent.HAIR, hairStyle, 0, 2);
  player.setHairColor(hairColor, hairHighlightColor);

  player.setHeadOverlay(RageEnums.HeadOverlays.FacialHair, [beardStyle, beardOpacity, beardColor, beardColor]);

  faceFeature.forEach(
    (value, index) => player.setFaceFeature(index, value));

  headOverlayInfo.forEach(({ key, overlayId }) => {
    const headOverlay = headOverlays[key] as HeadOverlayComponent;

    if (headOverlay)
      player.setHeadOverlay(overlayId, [headOverlay.value, headOverlay.opacity, headOverlay.color, headOverlay.color]);
  });

  loadPlayerClothing(player);
};

async function createPlayerOutfit(player: PlayerMp, selectedOutfit: number) {
  const outfit = defaultOutfits[player.character.gender][selectedOutfit];
  if (outfit) {
    for (const clothing of outfit) {
      const wearableItem = getWearableItemByComponent(clothing.componentId);
      if (wearableItem) {
        await playerGiveItem(player, wearableItem.name, 1, {
          equipped: true,
          wearableInfo: {
            model: player.model === RageEnums.Hashes.Ped.MP_M_FREEMODE_01 ? 'mp_m_freemode_01' : 'mp_f_freemode_01',
            drawable: clothing.drawable,
            texture: clothing.texture,
            palette: clothing.palette
          }
        });
      }
    }
  }
}

export const spawnPlayerCharacter = async (player: PlayerMp, initialSpawn = false, selectedOutfit?: number) => {
  if (!player.character) return;

  loadPlayerVariables(player);

  if (initialSpawn) {
    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, false);

    player.character.position = characterConfig.defaultPosition;
    player.character.dimension = characterConfig.defaultDimension;

    const bankAccount = await createBankAccount(player.character, BankAccountType.Main, characterConfig.defaultBankBalance);
    await createBankCardItem(player, bankAccount);

    if (selectedOutfit !== undefined)
      await createPlayerOutfit(player, selectedOutfit);
  } else {
    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, false);

    if (!player.character.isWounded) {
      switch (player.character.defaultSpawn.type) {
        case CharacterSpawnType.INITIAL_SPAWN: {
          player.character.position = characterConfig.defaultPosition;
          player.character.dimension = characterConfig.defaultDimension;
          break;
        }

        default:
      }
    }
  }

  await player.character.populate('inventory');
  triggerBrowsers(player, ProcedureKey.BROWSER_SET_INVENTORY, player.character.inventory);

  loadCharacterAppearance(player);

  player.character.inGame = true;

  player.name = player.character.fullName;
  player.spawn(player.character.position);
  player.dimension = player.character.dimension;
  player.alpha = 255;

  await player.character.save();
  player.account.depopulate('characters');
};


export const selectCharacter = (player: PlayerMp, characterId: string) => {
  getCharacterById(characterId)
    .then((character) => {
      if (!character)
        return;

      player.character = character;
      spawnPlayerCharacter(player);
    });
};


export const setPlayerWounded = (player: PlayerMp, state: boolean) => {
  player.character.isWounded = state;
  player.setVariable(PlayerSharedDataType.IsWounded, state);
};

export const setPlayerHealth = (player: PlayerMp, health: number) => {
  player.character.health = health;
  player.health = health;
};


export const revivePlayer = (player: PlayerMp, position: Vector3) => {
  let vehicle: VehicleMp | null = null, seat: number | null = null;

  if (player.vehicle) {
    vehicle = player.vehicle;
    seat = player.seat;
  }

  setPlayerWounded(player, false);
  setPlayerHealth(player, characterConfig.defaultHealth);
  player.spawn(position);
  clearPlayerDamages(player);

  if (vehicle) {
    player.putIntoVehicle(vehicle, seat);
  }
};

export const setPlayerOrganization = (player: PlayerMp, organization: Organization | null, isLeader = false) => {
  player.character.membership = organization ? {
    organization: organization._id, rank: null
  } : null;

  player.character.isLeader = organization ? isLeader : false;

  player.setVariable(PlayerSharedDataType.Organization, organization ? organization.id : null);
};


export const setPlayerOrganizationRank = (player: PlayerMp, rank: OrganizationRank) => {
  if (!player.character.membership) return;
  player.character.membership.rank = rank._id;
};

export const getPlayerOrganizationId = (player: PlayerMp) => {
  return player.getVariable<string | null>(PlayerSharedDataType.Organization);
};

export const setPlayerJob = async (player: PlayerMp, property: Property | null) => {
  if (property) {
    const job = property.job;
    if (job) {
      player.character.job = {
        jobKey: job.key,
        property: property._id,
        salary: job.baseSalary,
        createdAt: new Date()
      };

      player.setVariable(PlayerSharedDataType.Job, job.key);
    }
  } else {
    player.character.job = null;
    player.setVariable(PlayerSharedDataType.Job, null);
  }


  await player.character.save();
};
