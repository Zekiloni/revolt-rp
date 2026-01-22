import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/main').then(m => m.MainComponent)
  },
  {
    path: 'headless/:interfaceKey',
    loadComponent: () => import('./views/headless-host').then(m => m.HeadlessHostComponent)
  }
];
