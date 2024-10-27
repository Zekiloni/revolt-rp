export interface HeadOverlayComponent {
  value: number
  color: number
  opacity: number
}

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
  beardStyle: number;
  beardColor: number;
  beardOpacity: number;
  faceFeature: [
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number
  ];
  headBlendData: HeadBlendData;
  headOverlays: {
    blemishes: HeadOverlayComponent;
    eyebrows: HeadOverlayComponent;
    ageing: HeadOverlayComponent;
    makeup: HeadOverlayComponent;
    blush: HeadOverlayComponent;
    complexion: HeadOverlayComponent;
    sunDamage: HeadOverlayComponent;
    lipstick: HeadOverlayComponent;
    molesFreckles: HeadOverlayComponent;
    chestHair: HeadOverlayComponent;
  };
}
