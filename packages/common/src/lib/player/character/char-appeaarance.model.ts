
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


export interface ICharacterAppearance extends HeadBlendData, FaceFeature {
  eyeColor: number;
  hairStyle: number;
  hairColor: number;
  hairHighlightColor: number;
}
