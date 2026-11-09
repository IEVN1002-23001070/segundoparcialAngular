
import { Routes } from '@angular/router';

export const routes: Routes = [

  // FORMULARIOS
  {
    path: 'formularios',
    children: [
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./formularios/usuario/usuario').then(
            c => c.Usuario
          )
      },
      {
        path: 'zodiaco',
        loadComponent: () =>
          import('./formularios/zodiaco/zodiaco').then(
            c => c.Zodiaco
          )
      }
    ]
  },

  // UTL
  {
    path: 'utl',
    children: [

      // ALUMNOS
      {
        path: 'alumnos',
        loadComponent: () =>
          import('./utl/alumnos/alumnos/alumnos').then(
            c => c.Alumnos
          )
      },
      {
        path: 'alumnos/agregar',
        loadComponent: () =>
          import('./utl/alumnos/agregar/agregar').then(
            c => c.Agregar
          )
      },
      {
        path: 'alumnos/editar/:matricula',
        loadComponent: () =>
          import('./utl/alumnos/editar/editar').then(
            c => c.Editar
          )
      },
      {
        path: 'alumnos/eliminar/:matricula',
        loadComponent: () =>
          import('./utl/alumnos/eliminar/eliminar').then(
            c => c.Eliminar
          )
      },

      // MAESTROS
      {
        path: 'maestros',
        loadComponent: () =>
          import('./utl/maestros/maestros/maestros').then(
            c => c.Maestros
          )
      },
      {
        path: 'maestros/agregar',
        loadComponent: () =>
          import('./utl/maestros/agregar/agregar').then(
            c => c.Agregar
          )
      },
      {
        path: 'maestros/editar/:idmaestro',
        loadComponent: () =>
          import('./utl/maestros/editar/editar').then(
            c => c.Editar
          )
      },
      {
        path: 'maestros/eliminar/:idmaestro',
        loadComponent: () =>
          import('./utl/maestros/eliminar/eliminar').then(
            c => c.Eliminar
          )
      }

    ]
  },

  // ESCUELA
  {
    path: 'escuela',
    children: [
      {
        path: 'ListaAlumnos',
        loadComponent: () =>
          import('./escuela/lista-alumnos/lista-alumnos').then(
            c => c.ListaAlumnos
          )
      },
      {
        path: 'cinepolis',
        loadComponent: () =>
          import('./escuela/cinepolis/cinepolis').then(
            c => c.Cinepolis
          )
      },
      {
        path: 'ver-registros',
        loadComponent: () =>
          import('./escuela/ver-registros/ver-registros').then(
            c => c.VerRegistros
          )
      }
    ]
  },

  // INICIO
  {
    path: '',
    redirectTo: 'utl/alumnos',
    pathMatch: 'full'
  },

  // RUTAS NO ENCONTRADAS
  {
    path: '**',
    redirectTo: 'utl/alumnos'
  }

];
