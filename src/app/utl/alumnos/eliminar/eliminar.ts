
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink,
  ActivatedRoute
} from '@angular/router';

import { timeout, finalize } from 'rxjs';

import { AlumnosUtl } from '../alumnos';
import { ProyectoapiAlumnosService } from '../proyectoapialumnos.service';

@Component({
  selector: 'app-eliminar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './eliminar.html'
})
export class Eliminar implements OnInit {

  matricula: string = '';

  alumno: AlumnosUtl | null = null;

  mensaje: string = '';
  cargando: boolean = false;
  eliminando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public alumnosUtl: ProyectoapiAlumnosService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.matricula =
      this.route.snapshot.paramMap.get('matricula') || '';

    if (!/^\d+$/.test(this.matricula)) {
      this.mensaje = 'Matrícula no válida.';
      return;
    }

    this.cargarAlumno();
  }

  cargarAlumno(): void {

    this.cargando = true;
    this.mensaje = '';

    this.alumnosUtl.getAlumno(this.matricula)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.cargando = false;
          this.cd.markForCheck();
        })
      )
      .subscribe({

        next: (response) => {

          if (response.exito && response.alumno) {
            this.alumno = response.alumno;
          } else {
            this.mensaje =
              response.mensaje || 'Alumno no encontrado.';
          }
        },

        error: (error) => {

          console.error('Error al consultar alumno:', error);

          this.mensaje =
            error.error?.mensaje ||
            'No se pudo obtener la información del alumno.';
        }
      });
  }

  confirmarEliminar(): void {

    if (!this.alumno || this.eliminando) {
      return;
    }

    this.eliminando = true;
    this.mensaje = '';

    this.alumnosUtl.EliminaAlumno(
      this.alumno.matricula
    ).subscribe({

      next: (respuesta) => {

        this.eliminando = false;
        this.cd.markForCheck();

        if (respuesta.exito) {

          alert('Alumno eliminado correctamente');

          this.router.navigate(['/utl/alumnos']);

        } else {
          this.mensaje =
            respuesta.mensaje || 'No se pudo eliminar el alumno.';
        }
      },

      error: (error) => {

        this.eliminando = false;

        console.error('Error al eliminar:', error);

        this.mensaje =
          error.error?.mensaje ||
          'Ocurrió un error al eliminar el alumno.';

        this.cd.markForCheck();
      }
    });
  }
}
