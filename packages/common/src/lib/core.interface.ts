export declare type Array2d = [number, number];
export declare type Array3d = [number, number, number];
export declare type Array4d = [number, number, number, number];

export interface IVector3 {
   x: number;
   y: number;
   z: number;

  add(otherVec: IVector3 | number): IVector3;
  angleTo(otherVec: IVector3): number;
  clone(): IVector3;
  cross(otherVec: IVector3): IVector3;
  divide(otherVec: IVector3 | number): IVector3;
  dot(otherVec: IVector3): number;
  equals(otherVec: IVector3): boolean;
  length(): number;
  max(): number;
  min(): number;
  multiply(otherVec: IVector3 | number): IVector3;
  negative(): IVector3;
  subtract(otherVec: IVector3 | number): IVector3;
  toAngles(): Array2d;
  toArray(): Array3d;
  unit(): IVector3;
}
