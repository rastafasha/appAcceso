import { Routes } from '@angular/router';
import { authGuard, rolGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./auth/registro/registro.component').then(m => m.RegistroComponent)
  },
  
  // 🏠 GRUPO DE RUTAS PARA EL PROPIETARIO
  // Delegamos el control a un archivo de rutas propio dentro de su carpeta
  {
    path: 'propietario',
    canActivate: [authGuard, rolGuard], // Primero valida login, luego el rol
    data: { roles: ['PROPIETARIO'] },
    loadChildren: () => import('./pages/propietario/tabs/tabs.routes').then(m => m.TABS_ROUTES)
  },

  // 🛡️ GRUPO DE RUTAS PARA EL GUARDIA
  // Para el guardia no usamos pestañas, usamos rutas secuenciales directas
  {
    path: 'guardia',
    canActivate: [authGuard, rolGuard], // Primero valida login, luego el rol
    data: { roles: ['GUARDIA'] }, 
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/guardia/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'scanner',
        loadComponent: () => import('./pages/guardia/scanner/scanner.component').then(m => m.ScannerComponent)
      },
      {
        path: 'bitacora',
        loadComponent: () => import('./pages/guardia/bitacora/bitacora.component').then(m => m.BitacoraComponent)
      },
      {
        path: 'resultado',
        loadComponent: () => import('./pages/guardia/resultado/resultado.component').then(m => m.ResultadoComponent)
      }
    ]
  },
  
  // Ruta comodín para manejar errores 404
  {
    path: '**',
    redirectTo: 'login'
  }
];
