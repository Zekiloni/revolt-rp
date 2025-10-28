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
      import('./views/ucp/dashboard-page').then(m => m.DashboardPageComponent)
  }
];
