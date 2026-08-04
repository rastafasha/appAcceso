import { Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

export const TABS_ROUTES: Routes = [
  {
    path: '',
    component: TabsComponent, // El diseño base de las pestañas
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('../home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'visitas',
        loadComponent: () => import('../visitas/visitas.component').then(m => m.VisitasComponent)
      },
      {
        path: 'perfil',
        loadComponent: () => import('../perfil/perfil.component').then(m => m.PerfilComponent)
      },
      {
        path: 'generar-visita',
        loadComponent: () => import('../generar-visita/generar-visita.component').then(m => m.GenerarVisitaComponent)
      },
      {
        path: 'generar-visita',
        loadComponent: () => import('../generar-visita/generar-visita.component').then(m => m.GenerarVisitaComponent)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  }
];
