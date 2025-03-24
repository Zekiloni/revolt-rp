

export enum DrivingLicenseCategory {
  Vehicle = 'vehicle',
  Truck = 'truck',
}

export interface IDocumentInfo {
  name: string;
  birthday: Date;
  origin: string;
  category?: DrivingLicenseCategory;
}
