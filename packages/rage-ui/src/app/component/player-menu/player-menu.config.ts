import { AccountOverviewComponent } from './components/account-overview';
import { CharacterOverviewComponent } from './components/character-overview';
import { PropertiesOverviewComponent } from './components/properties-overview';
import { VehiclesOverviewComponent } from './components/vehicles-overview';


export const playerMenuItems = [
  {
    label: 'player_menu.account_overview',
    icon: 'pi pi-user',
    description: 'player_menu.account_overview_description',
    component: AccountOverviewComponent
  },
  {
    label: 'player_menu.character_overview',
    icon: 'pi pi-info-circle',
    description: 'player_menu.character_overview_description',
    component: CharacterOverviewComponent
  },
  {
    label: 'player_menu.properties',
    icon: 'pi pi-home',
    description: 'player_menu.properties_description',
    component: PropertiesOverviewComponent
  },
  {
    label: 'player_menu.vehicles',
    icon: 'pi pi-car',
    description: 'player_menu.vehicles_description',
    component: VehiclesOverviewComponent
  },
  {
    label: 'player_menu.organization',
    icon: 'pi pi-users',
    description: 'player_menu.organization_description'
  }
];
