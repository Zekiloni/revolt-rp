import { triggerBrowsers, triggerClient } from '@libertymp/rage-rpc';
import {
  CharacterGender,
  CharacterSpawnType,
  HeadOverlayComponent, headOverlays as headOverlayInfo,
  ICharacterCreate, PlayerSharedDataType,
  ProcedureKey
} from '@bcrp-rage/common';
import { characterConfig } from './character.config';
import { AccountModel, CharacterModel } from '../account-character.ref';


export const createCharacter = async (player: PlayerMp, characterCreate: ICharacterCreate) => {
  try {
    const character = await CharacterModel.create({
      ...characterCreate,
      cash: 5000
    });

    await AccountModel.updateOne(
      { id: player.account.id },
      { $push: { characters: character._id } }
    );

    return character;
  } catch (e) {
    return e;
  }
};

export const getCharacterById = (characterId: string) => {
  return CharacterModel.findById(characterId);
};


const loadPlayerVariables = (player: PlayerMp) => {
  player.setVariables({
    [PlayerSharedDataType.IsSpawned]: true,
    [PlayerSharedDataType.Cash]: player.character.cash,
    [PlayerSharedDataType.State]: player.character.state,
    [PlayerSharedDataType.Administrator]: player.account.administrator,
    [PlayerSharedDataType.TextBubble]: null,
    [PlayerSharedDataType.SelectedItemId]: null,
    [PlayerSharedDataType.IsRestrained]: player.character.isRestrained
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
};

export const spawnPlayerCharacter = async (player: PlayerMp, initialSpawn = false) => {
  if (!player.character) return;

  loadPlayerVariables(player);

  if (initialSpawn) {
    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_CHARACTER_CREATOR, false);

    player.character.position = characterConfig.defaultPosition;
    player.character.dimension = characterConfig.defaultDimension;
  } else {
    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PLAYER_AUTHORIZATION, false);

    switch (player.character.defaultSpawn.type) {
      case CharacterSpawnType.INITIAL_SPAWN: {
        player.character.position = characterConfig.defaultPosition;
        player.character.dimension = characterConfig.defaultDimension;
        break;
      }

      default:
    }
  }

  loadCharacterAppearance(player);

  player.name = player.character.fullName;
  player.spawn(player.character.position);
  player.dimension = player.character.dimension;

  await player.character.populate('inventory');
  triggerBrowsers(player, ProcedureKey.BROWSER_SET_INVENTORY, player.character.inventory);

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
