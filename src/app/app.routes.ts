import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'analyzer',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/analyzer/analyzer.component').then(m => m.AnalyzerComponent)
  },
  { path: '**', redirectTo: 'login' }
];
