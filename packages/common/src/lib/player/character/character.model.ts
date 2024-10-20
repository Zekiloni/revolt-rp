import {Ref} from '@typegoose/typegoose';
import {CharacterGender, CharacterSpawnType} from './character.enums';
import {IAccount} from '../account/account.model';
import {Vector3} from '../../core.interface';

export interface HeadBlendData {
    headBlendData: {
        shapeFirstId: number,
        shapeSecondId: number,
        shapeThirdId: number,
        skinFirstId: number,
        skinSecondId: number,
        skinThirdId: number,
        shapeMix: number,
        skinMix: number,
        thirdMix: number,
        isParent: boolean
    };
}

export interface FaceFeature {
    faceFeature: [
        number, number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number,
        number, number, number, number
    ];
}

export interface CharacterAppearance extends HeadBlendData, FaceFeature {
    eyeColor: number;
    hairStyle: number;
    hairColor: number;
    hairHighlightColor: number;
}

export interface CharacterSpawn {
    type: CharacterSpawnType;
    propertyId?: string;
}

export interface InventoryItem {
    item: string;
    localSlot?: number
}

export interface ICharacter {
    id: string;

    account: Ref<(IAccount)>;

    firstName: string;

    lastName: string;

    birthday: Date;

    appearance: CharacterAppearance;

    defaultSpawn: CharacterSpawn;

    gender: CharacterGender;

    inventory: InventoryItem[];

    maxProperties: number;

    maxVehicles: number;

    position: Vector3;
}
