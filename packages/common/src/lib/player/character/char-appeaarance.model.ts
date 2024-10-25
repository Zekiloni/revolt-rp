export interface HeadBlendData {
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
}

export interface ICharacterAppearance {
  eyeColor: number;
  hairStyle: number;
  hairColor: number;
  hairHighlightColor: number;
  faceFeature: [
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number
  ];
  headBlendData: HeadBlendData;
}
