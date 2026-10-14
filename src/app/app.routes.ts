import { Routes } from '@angular/router';
import { Cinepolis } from './escuela/cinepolis/cinepolis';
import { VerRegistros } from './escuela/ver-registros/ver-registros';

export const routes: Routes = [
  // Conserva aquí tus rutas actuales de Zodiaco,
  // Usuarios y ListaAlumnos.

  {
    path: 'escuela/cinepolis',
    component: Cinepolis
  },
  {
    path: 'escuela/ver-registros',
    component: VerRegistros
  }
];