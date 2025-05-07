import { IWorkOptions, IWorkStartOptions, JobKey, PlayerSharedDataType } from '@revolt-rp/common';
import { BaseJob } from './base-job.model';
import { Property } from '../property/property.model';
import { getPropertyAvailableParkingSpot } from '../property/property.service';
import { createTemporaryVehicle } from '../vehicle/vehicle.service';


export class SanitationJob extends BaseJob {

  constructor() {
    super(JobKey.Sanitation, 'sanitation', 'sanitation_job_description');

    this.clothing = {
      [RageEnums.Hashes.Ped.MP_F_FREEMODE_01]: [
        {
          componentId: RageEnums.ClothesComponent.DECALS, // 11
          drawable: 0,
          texture: 0,
          palette: 0
        },
        {
          componentId: RageEnums.ClothesComponent.LEGS, // 4
          drawable: 35,
          texture: 0,
          palette: 0
        },
        {
          componentId: RageEnums.ClothesComponent.SHOES, // 8
          drawable: 219,
          texture: 0,
          palette: 0
        }
      ],
      [RageEnums.Hashes.Ped.MP_M_FREEMODE_01]: [
        {
          componentId: RageEnums.ClothesComponent.AUXILIARY, // 11
          drawable: 0,
          texture: 0,
          palette: 0
        },
        {
          componentId: RageEnums.ClothesComponent.LEGS, // 4
          drawable: 36,
          texture: 0,
          palette: 0
        },
        {
          componentId: RageEnums.ClothesComponent.SHOES, // 8
          drawable: 181,
          texture: 0,
          palette: 0
        }
      ]
    };
  }

  startJob(player: PlayerMp, property: Property, options: IWorkStartOptions): void {
    const work: IWorkOptions = {
      startedAt: new Date(),
      jobKey: this.key
    };

    const propertyAvailableParkingSpot = getPropertyAvailableParkingSpot(property);

    if (!propertyAvailableParkingSpot) {
      return;
    }

    const position = new mp.Vector3(propertyAvailableParkingSpot.position.x, propertyAvailableParkingSpot.position.y, propertyAvailableParkingSpot.position.z);
    const rotation = new mp.Vector3(propertyAvailableParkingSpot.rotation.x, propertyAvailableParkingSpot.rotation.y, propertyAvailableParkingSpot.rotation.z);

    const vehicle = createTemporaryVehicle('trash2', position, 0, 0, {
      owner: player.character,
      rotation,
      jobKey: this.key
    });

    player.putIntoVehicle(vehicle, RageEnums.VehicleSeat.DRIVER);

    player.setVariable(PlayerSharedDataType.Work, work);

    this.equip(player);
  }

  stopJob(player: PlayerMp, completed: boolean): void {
    player.setVariable(PlayerSharedDataType.Work, null);
    this.unequip(player);
  }
}
