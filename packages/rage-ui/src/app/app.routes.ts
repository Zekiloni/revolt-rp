import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'headless/:interfaceKey',
    loadComponent: () => import('./component/headless-host').then(m => m.HeadlessHostComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
