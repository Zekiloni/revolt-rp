import { Route } from '@angular/router';
import { authGuard } from './core/util/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./views/home-page').then(m => m.HomePageComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./views/ucp/dashboard-page').then(m => m.DashboardPageComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/ucp/account-overview').then(m => m.AccountOverviewComponent)
      },
      {
        path: 'whitelist',
        loadComponent: () =>
          import('./views/ucp/dashboard-page/components/whitelist').then(m => m.WhitelistComponent)
      },
      {
        path: 'character/:characterId',
        loadComponent: () =>
          import('./views/ucp/dashboard-page/components/character-view').then(m => m.CharacterViewComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/ucp/character-overview').then(m => m.CharacterOverviewComponent)
          },
          {
            path: 'garage',
            loadComponent: () =>
              import('./components/ucp/character-vehicles').then(m => m.CharacterVehiclesComponent)
          },
          {
            path: 'property',
            loadComponent: () =>
              import('./components/ucp/character-property').then(m => m.CharacterPropertyComponent)
          }
        ]
      },
      {
        path: 'admin/whitelist',
        loadComponent: () =>
          import('./components/ucp/manage-whitelist-applications').then(m => m.ManageWhitelistApplicationsComponent)
      }
    ]
  }
];
