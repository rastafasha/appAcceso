import { Routes } from '@angular/router';
import { GtabsComponent } from './gtabs.component';

export const GUARDIA_TABS_ROUTES: Routes = [
  {
    path: '',
    component: GtabsComponent, // El diseño base de las pestañas
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'scanner',
        loadComponent: () => import('../scanner/scanner.component').then(m => m.ScannerComponent)
      },
      {
        path: 'bitacora',
        loadComponent: () => import('../bitacora/bitacora.component').then(m => m.BitacoraComponent)
      },
      {
        path: 'resultado',
        loadComponent: () => import('../resultado/resultado.component').then(m => m.ResultadoComponent)
      },
      {
        path: 'gperfil',
        loadComponent: () => import('../gperfil/gperfil.component').then(m => m.GperfilComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
