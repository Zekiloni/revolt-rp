import { MapComponent } from '../../component/item/smartphone/components/map/map.component';
import { CalculatorComponent } from '../../component/item/smartphone/components/calculator';
import { MessengerComponent } from '../../component/item/smartphone/components/messenger';
import { PhonebookComponent } from '../../component/item/smartphone/components/phonebook';
import { SettingsComponent } from '../../component/item/smartphone/components/settings';
import { CameraComponent } from '../../component/item/smartphone/components/camera';
import { IApplication } from '../../component/item/smartphone';
import { KeypadComponent } from '../../component/item/smartphone/components/keypad';


export const phoneApplications: IApplication[] = [
  {
    key: 'contacts',
    name: 'contacts',
    icon: 'assets/images/phone/icons/contacts.svg',
    pinned: true,
    component: PhonebookComponent
  },
  {
    key: 'calls',
    name: 'calls',
    icon: 'assets/images/phone/icons/calls.svg',
    pinned: true,
    component: KeypadComponent
  }, {
    key: 'messages',
    name: 'messages',
    icon: 'assets/images/phone/icons/messages.svg',
    pinned: true,
    component: MessengerComponent
  },
  {
    key: 'calculator',
    name: 'calculator',
    icon: 'assets/images/phone/icons/calculator.svg',
    component: CalculatorComponent
  },
  {
    key: 'settings',
    name: 'settings',
    icon: 'assets/images/phone/icons/settings.svg',
    component: SettingsComponent
  },
  {
    key: 'camera',
    name: 'camera',
    icon: 'assets/images/phone/icons/camera.svg',
    component: CameraComponent
  },
  {
    key: 'notes',
    name: 'notes',
    icon: 'assets/images/phone/icons/notes.svg',
    component: CalculatorComponent
  },
  {
    key: 'map',
    name: 'map',
    icon: 'assets/images/phone/icons/maps.svg',
    component: MapComponent
  }
];
