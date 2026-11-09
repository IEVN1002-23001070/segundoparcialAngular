
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink,
  ActivatedRoute
} from '@angular/router';

import { AlumnosUtl } from '../alumnos';
import { ProyectoapiAlumnosService } from '../proyectoapialumnos.service';
import { timeout, finalize } from 'rxjs';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './editar.html'
})
export class Editar implements OnInit {

  formulario!: FormGroup;

  matricula: string = '';
  mensaje: string = '';

  cargando: boolean = false;
  guardando: boolean = false;
  alumnoCargado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public alumnosUtl: ProyectoapiAlumnosService,
    private fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.formulario = this.fb.group({
      matricula: [{ value: '', disabled: true }],
      nombre: ['', Validators.required],
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });

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
    this.alumnoCargado = false;
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

            this.formulario.patchValue(response.alumno);
            this.alumnoCargado = true;

          } else {
            this.mensaje =
              response.mensaje || 'Alumno no encontrado.';
          }
        },

        error: (error) => {

          console.error('Error al consultar alumno:', error);

          this.mensaje =
            error.error?.mensaje ||
            'No se pudieron cargar los datos del alumno.';
        }
      });
  }

  onSubmit(): void {

    if (
      this.formulario.invalid ||
      this.guardando ||
      this.cargando ||
      !this.alumnoCargado
    ) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    const alumno: AlumnosUtl = {
      matricula: Number(this.matricula),
      nombre: String(valores.nombre).trim(),
      apaterno: String(valores.apaterno).trim(),
      amaterno: String(valores.amaterno).trim(),
      correo: String(valores.correo).trim()
    };

    if (
      !alumno.nombre ||
      !alumno.apaterno ||
      !alumno.amaterno ||
      !alumno.correo
    ) {
      this.mensaje = 'Todos los campos son obligatorios.';
      return;
    }

    this.guardando = true;
    this.mensaje = '';

    this.alumnosUtl.modificarAlumno(
      Number(this.matricula),
      alumno
    ).subscribe({

      next: (respuesta) => {

        this.guardando = false;
        this.cd.markForCheck();

        if (respuesta.exito) {

          alert('Alumno actualizado correctamente');

          this.router.navigate(['/utl/alumnos']);

        } else {
          this.mensaje =
            respuesta.mensaje || 'No se pudo modificar el alumno.';
        }
      },

      error: (error) => {

        this.guardando = false;

        console.error('Error al modificar:', error);

        this.mensaje =
          error.error?.mensaje ||
          'Ocurrió un error al modificar el alumno.';

        this.cd.markForCheck();
      }
    });
  }
}
