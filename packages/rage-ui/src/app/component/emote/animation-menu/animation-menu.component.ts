import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { TreeSelectModule } from 'primeng/treeselect';
import { FormsModule } from '@angular/forms';
import { fadeInOutTrigger } from '../../../domain/util/animation.util';
import { CardModule } from 'primeng/card';
import { PlayerSharedDataType, ProcedureKey, walkingStyles } from '@revolt-rp/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TranslatePipe } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { RageClientService } from '../../../domain/service/rage-client.service';


enum AnimMenuOptionType {
  Animation = 'animation',
  WalkStyle = 'walkStyle',
  FaceExpression = 'faceExpression',
}

@Component({
  selector: 'app-animation-menu',
  standalone: true,
  imports: [CommonModule, SpeedDialModule, TreeSelectModule, FormsModule, CardModule, RadioButtonModule, TranslatePipe, DropdownModule],
  templateUrl: './animation-menu.component.html',
  styleUrl: './animation-menu.component.css',
  animations: [fadeInOutTrigger]
})
export class AnimationMenuComponent {
  protected readonly AnimMenuOptionType = AnimMenuOptionType;
  protected readonly walkingStyles = walkingStyles;

  selectedWalkingStyle: { name: string, value: string } | null = null;

  selectedOption: AnimMenuOptionType | null = null;

  items: MenuItem[] = [
    {
      label: 'tesst',
      icon: 'pi pi-list',
      command: () => {
        this.selectedOption = AnimMenuOptionType.Animation;
      }
    },
    {
      icon: 'pi pi-face-smile',
      command: () => {
        this.selectedOption = AnimMenuOptionType.FaceExpression;
      }
    },
    {
      icon: 'pi pi-compass',
      command: () => {
        this.selectedOption = AnimMenuOptionType.WalkStyle;
        this.loadCurrentWalkingStyle();
      }
    }
  ];

  nodes = [
    {
      key: '0',
      label: 'Documents',
      data: 'Documents Folder',
      icon: 'pi pi-fw pi-inbox',
      children: [
        {
          key: '0-0',
          label: 'Work',
          data: 'Work Folder',
          icon: 'pi pi-fw pi-cog',
          children: [
            { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
            { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
          ]
        },
        {
          key: '0-1',
          label: 'Home',
          data: 'Home Folder',
          icon: 'pi pi-fw pi-home',
          children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
        }
      ]
    },
    {
      key: '1',
      label: 'Events',
      data: 'Events Folder',
      icon: 'pi pi-fw pi-calendar',
      children: [
        { key: '1-0', label: 'Meeting', icon: 'pi pi-fw pi-calendar-plus', data: 'Meeting' },
        { key: '1-1', label: 'Product Launch', icon: 'pi pi-fw pi-calendar-plus', data: 'Product Launch' },
        { key: '1-2', label: 'Report Review', icon: 'pi pi-fw pi-calendar-plus', data: 'Report Review' }
      ]
    },
    {
      key: '2',
      label: 'Movies',
      data: 'Movies Folder',
      icon: 'pi pi-fw pi-star-fill',
      children: [
        {
          key: '2-0',
          icon: 'pi pi-fw pi-star-fill',
          label: 'Al Pacino',
          data: 'Pacino Movies',
          children: [
            { key: '2-0-0', label: 'Scarface', icon: 'pi pi-fw pi-video', data: 'Scarface Movie' },
            { key: '2-0-1', label: 'Serpico', icon: 'pi pi-fw pi-video', data: 'Serpico Movie' }
          ]
        },
        {
          key: '2-1',
          label: 'Robert De Niro',
          icon: 'pi pi-fw pi-star-fill',
          data: 'De Niro Movies',
          children: [
            { key: '2-1-0', label: 'Goodfellas', icon: 'pi pi-fw pi-video', data: 'Goodfellas Movie' },
            {
              key: '2-1-1',
              label: 'Untouchables',
              icon: 'pi pi-fw pi-video',
              data: 'Untouchables Movie',
              selectable: false
            }
          ]
        }
      ]
    }
  ];

  constructor(private rageClientService: RageClientService) {
  }

  selectedNode: null | any = null;

  getWalkingStyleByValue(value: string) {
    return walkingStyles.find(style => style.value === value);
  }

  loadCurrentWalkingStyle = () => {
    this.rageClientService.callServer<string | null>(ProcedureKey.SERVER_PLAYER_GET_VARIABLE, PlayerSharedDataType.WalkingStyle)
      .subscribe({
        next: (walkingStyle) => {
          this.selectedWalkingStyle = walkingStyle ? (this.getWalkingStyleByValue(walkingStyle) ?? null) : null;
        }
      });
  };

  updateWalkingStyle() {
    const variable = [PlayerSharedDataType.WalkingStyle, this.selectedWalkingStyle ? this.selectedWalkingStyle.value : null];
    this.rageClientService.triggerServer(ProcedureKey.SERVER_PLAYER_SET_VARIABLE, variable);
  }

  closeAnimationMenu() {
    this.rageClientService.triggerClient(ProcedureKey.CLIENT_TOGGLE_ANIMATION_MENU, false);
  }
}
