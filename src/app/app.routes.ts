import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mapa'
    },
    {
        path: 'mapa',
        // Lazy Loading a nivel de componente
        loadComponent: () => import('./features/map/components/map-shell/map-shell.component').then(m => m.MapShellComponent)
    }
];
