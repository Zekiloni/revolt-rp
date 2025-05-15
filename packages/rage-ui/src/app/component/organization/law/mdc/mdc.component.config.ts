import { MenuItem } from 'primeng/api';

export type MdcApplicationKey = 'finder' | 'terminal' | 'gang_net';

export const menubarItems = (openApplication: (key: MdcApplicationKey) => void): MenuItem[] => [
  {
    label: 'mobile_data_computer',
    styleClass: 'menubar-root font-bold'
  },
  {
    label: 'records',
    icon: 'pi pi-fw pi-book',
    items: [
      {
        label: 'new',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            label: 'warrant',
            icon: 'pi pi-fw pi-file'
          },
          {
            label: 'criminal_record',
            icon: 'pi pi-fw pi-video'
          }
        ]
      },
      {
        label: 'active_warrants',
        icon: 'pi pi-fw pi-trash'
      },
      {
        separator: true
      },
      {
        label: 'in_custody',
        icon: 'pi pi-fw pi-external-link'
      }
    ]
  },
  {
    label: 'officers',
    icon: 'pi pi-fw pi-users',
    items: [
      {
        label: 'on_duty',
        icon: 'pi pi-fw pi-user-plus'
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-user-minus'
      },
      {
        label: 'Search',
        icon: 'pi pi-fw pi-users',
        items: [
          {
            label: 'Filter',
            icon: 'pi pi-fw pi-filter',
            items: [
              {
                label: 'Print',
                icon: 'pi pi-fw pi-print'
              }
            ]
          },
          {
            icon: 'pi pi-fw pi-bars',
            label: 'List'
          }
        ]
      }
    ]
  }
];


export const dockMenuItems = (openApplication: (key: MdcApplicationKey) => void): MenuItem[] => [
  {
    label: 'finder',
    tooltipOptions: {
      tooltipLabel: 'finder',
      tooltipPosition: 'top',
      positionTop: -15,
      positionLeft: 15,
      showDelay: 1000
    },
    icon: 'assets/images/mdc/finder.svg',
    command: () => {
      openApplication('finder');
    }
  },
  {
    label: 'terminal',
    tooltipOptions: {
      tooltipLabel: 'terminal',
      tooltipPosition: 'top',
      positionTop: -15,
      positionLeft: 15,
      showDelay: 1000
    },
    icon: 'assets/images/mdc/terminal.svg',
    command: () => {
      openApplication('terminal');
    }
  },
  {
    label: 'gang_net',
    tooltipOptions: {
      tooltipLabel: 'gang_net',
      tooltipPosition: 'top',
      positionTop: -15,
      positionLeft: 15,
      showDelay: 1000
    },
    icon: 'assets/images/mdc/gang_net.svg',
    command: () => {
      openApplication('gang_net');
    }
  }
];

export const responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 3
  },
  {
    breakpoint: '768px',
    numVisible: 2
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
];
