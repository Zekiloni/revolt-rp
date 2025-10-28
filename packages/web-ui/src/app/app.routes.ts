import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./views/home-page').then(m => m.HomePageComponent)
  }
];
