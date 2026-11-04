import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'archivos',
    loadComponent: () => import('./registros/registros.page').then((m) => m.RegistrosPage),
  },
  {
    path: 'registros',
    redirectTo: 'archivos',
    pathMatch: 'full',
  },
  {
    path: 'cuenta',
    loadComponent: () => import('./cuenta/cuenta.page').then((m) => m.CuentaPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
