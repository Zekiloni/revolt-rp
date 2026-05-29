import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { VehicleInventoryComponent } from '../../component/vehicle/vehicle-inventory';
import { VehicleMenuComponent } from '../../component/vehicle/vehicle-menu';
import { TextChatComponent } from '../../component/text-chat';
import { InventoryComponent } from '../../component/inventory';
import { HudComponent } from '../../component/hud';
import { VehicleHudComponent } from '../../component/vehicle/vehicle-hud';
import { PlayerMenuComponent } from '../../component/player-menu';
import { PlayerOfferComponent } from '../../component/player-offer';
import { BankMenuComponent } from '../../component/banking/bank-menu';
import { BankAtmComponent } from '../../component/banking/bank-atm';
import { AnimationMenuComponent } from '../../component/emote/animation-menu';
import { DeathScreenComponent } from '../../component/death-screen';
import { PlayerDamageInfoComponent } from '../../component/player-damage-info';
import { CreateOrganizationComponent } from '../../component/organization/create-organization';
import { ManageOrganizationComponent } from '../../component/organization/manage-organization';
import { HandheldRadioComponent } from '../../component/item/handheld-radio/handheld-radio.component';
import { BanInfoComponent } from '../../component/ban-info';
import { CreatePropertyComponent } from '../../component/property/create-property';
import { PropertyInfoComponent } from '../../component/property/property-info';
import { ManagePropertyComponent } from '../../component/property/manage-property';
import { SmartphoneComponent } from '../../component/item/smartphone';
import { HelpComponent } from '../../component/help';
import { DmvMenuComponent } from '../../component/property/public-service';
import { RentCatalogComponent } from '../../component/property/commercial/rent-catalog';
import { ManageVehicleComponent } from '../../component/vehicle/manage-vehicle';
import { GroceryStoreComponent } from '../../component/property/commercial/grocery-store';
import { ClothingStoreComponent } from '../../component/property/commercial/clothing-store';
import { VehicleDealershipComponent } from '../../component/property/commercial/vehicle-dealership';
import { JobMenuComponent } from '../../component/jobs/job-menu';
import { GrafitiCreatorComponent } from '../../component/grafiti-creator';
import { MdcComponent } from '../../component/organization/law/mdc';
import { PlateRecognitionComponent } from '../../component/organization/law/plate-recognition';
import { HeliCamComponent } from '../../component/organization/law/heli-cam';
import { GarageMenuComponent } from '../../component/property/garage-menu';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FishingComponent } from '../../component/minigames';
import { EquipmentMenuComponent } from '../../component/property/equipment-menu';
import { Audio3dComponent } from '../../component/audio';
import { AuthorizationComponent } from '../../component/authorization';
import { CharacterCreatorComponent } from '../../component/character-creator';
import { PrimeNG } from 'primeng/config';
import { isGameInterfaceActive } from '../../store/game-ui/game-ui.selector';
import { GameUiKey, ICommandBase, ProcedureKey } from '@revolt-rp/common';
import { Store } from '@ngrx/store';
import { Toast } from 'primeng/toast';
import { RageClientService } from '../../domain/service/rage-client.service';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { ToastMessageOptions } from 'primeng/api/toastmessage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, VehicleInventoryComponent, VehicleMenuComponent,
    AsyncPipe,
    AuthorizationComponent,
    CharacterCreatorComponent,
    TextChatComponent,
    InventoryComponent,
    HudComponent,
    VehicleHudComponent,
    PlayerMenuComponent,
    PlayerOfferComponent,
    BankMenuComponent,
    BankAtmComponent,
    AnimationMenuComponent,
    DeathScreenComponent,
    PlayerDamageInfoComponent,
    CreateOrganizationComponent,
    ManageOrganizationComponent,
    HandheldRadioComponent,
    BanInfoComponent,
    CreatePropertyComponent,
    PropertyInfoComponent,
    ManagePropertyComponent,
    SmartphoneComponent,
    HelpComponent,
    DmvMenuComponent,
    VehicleInventoryComponent,
    RentCatalogComponent,
    ManageVehicleComponent,
    VehicleMenuComponent,
    GroceryStoreComponent,
    ClothingStoreComponent,
    VehicleDealershipComponent,
    JobMenuComponent,
    GrafitiCreatorComponent,
    MdcComponent,
    PlateRecognitionComponent,
    HeliCamComponent,
    GarageMenuComponent,
    ConfirmDialog,
    FishingComponent,
    EquipmentMenuComponent,
    Audio3dComponent, Toast],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  store = inject(Store);
  rageClientService = inject(RageClientService);
  confirmationService = inject(ConfirmationService);
  translateService = inject(TranslateService);
  messageService = inject(MessageService);

  $isGameInterfaceActive = (name: GameUiKey) => this.store.select(isGameInterfaceActive(name));
  GameUiKey = GameUiKey;

  commands: ICommandBase[] = [];

  private getAllCommands() {
    this.rageClientService.callServer<ICommandBase[]>(ProcedureKey.SERVER_GET_COMMANDS)
      .subscribe(commands => {
        this.commands = Array.from(new Set(commands));
      });
  }

  private listenToNotificationEvents() {
    this.rageClientService.on(ProcedureKey.BROWSER_NOTIFICATION, (message: ToastMessageOptions) => {
      this.messageService.add({
        ...message,
        key: 'global',
        styleClass: 'bg-surface-900 bg-opacity-75 rounded-lg border-0',
        closable: false
      });
    });
  }

  private createConfirmationDialog = (confirmation: Confirmation) => {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        key: 'global',
        header: this.translateService.instant('confirmation'),
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-danger',
        ...confirmation,
        accept: () => resolve(true),
        reject: () => resolve(false)
      });
    });
  };

  ngOnInit() {
    this.rageClientService.register(ProcedureKey.BROWSER_CREATE_CONFIRMATION, this.createConfirmationDialog);
    this.listenToNotificationEvents();
    this.getAllCommands();
  }
}
