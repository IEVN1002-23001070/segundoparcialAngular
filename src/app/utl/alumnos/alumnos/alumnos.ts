
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout, finalize } from 'rxjs';

import { AlumnosUtl } from '../alumnos';
import { AlumnoFilterPipe } from '../alumnos-filter.pipe';
import { ProyectoapiAlumnosService } from '../proyectoapialumnos.service';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AlumnoFilterPipe
  ],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.css'
})
export class Alumnos implements OnInit {

  listFilter: string = '';
  mensaje: string = '';
  cargando: boolean = false;

  alumnosIric: AlumnosUtl[] = [];

  dataSource: { alumnos: AlumnosUtl[] } = {
    alumnos: []
  };

  constructor(
    public alumnosUtl: ProyectoapiAlumnosService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {

    this.cargando = true;
    this.mensaje = '';

    this.alumnosUtl.getAlumnos()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.cargando = false;
          this.cd.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {

          if (
            response.exito &&
            Array.isArray(response.alumnos)
          ) {
            this.dataSource.alumnos = response.alumnos;
            this.alumnosIric = response.alumnos;
          } else {
            this.mensaje =
              response.mensaje || 'No se pudieron cargar los alumnos.';
          }

        },

        error: (error) => {

          console.error(error);

          if (error.name === 'TimeoutError') {
            this.mensaje = 'Flask tardó demasiado en responder.';
          } else if (error.status === 0) {
            this.mensaje = 'No se pudo conectar con Flask.';
          } else {
            this.mensaje =
              error.error?.mensaje || 'Error al consultar alumnos.';
          }

        }
      });
  }
}
