
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AlumnosUtl } from '../alumnos';
import { ProyectoapiAlumnosService } from '../proyectoapialumnos.service';

@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './agregar.html'
})
export class Agregar implements OnInit {

  formGroup!: FormGroup;

  mensaje: string = '';
  guardando: boolean = false;

  constructor(
    private fb: FormBuilder,
    public alumnosUtl: ProyectoapiAlumnosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = this.initForm();
  }

  initForm(): FormGroup {
    return this.fb.group({
      matricula: [
        null,
        [Validators.required, Validators.min(1)]
      ],
      nombre: ['', Validators.required],
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {

    if (this.formGroup.invalid || this.guardando) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const valores = this.formGroup.getRawValue();

    const datos: AlumnosUtl = {
      matricula: Number(valores.matricula),
      nombre: String(valores.nombre).trim(),
      apaterno: String(valores.apaterno).trim(),
      amaterno: String(valores.amaterno).trim(),
      correo: String(valores.correo).trim()
    };

    if (
      !Number.isSafeInteger(datos.matricula) ||
      datos.matricula <= 0 ||
      !datos.nombre ||
      !datos.apaterno ||
      !datos.amaterno ||
      !datos.correo
    ) {
      this.mensaje = 'Completa correctamente todos los campos.';
      return;
    }

    this.guardando = true;
    this.mensaje = '';

    this.alumnosUtl.agregarNuevoAlumno(datos).subscribe({

      next: (respuesta) => {
        this.guardando = false;

        if (respuesta.exito) {
          alert('Alumno registrado correctamente');

          this.router.navigate(['/utl/alumnos']);
        } else {
          this.mensaje =
            respuesta.mensaje || 'No se pudo registrar el alumno.';
        }
      },

      error: (error) => {
        this.guardando = false;

        console.error('Error al registrar:', error);

        this.mensaje =
          error.error?.mensaje ||
          'Ocurrió un error al registrar el alumno.';
      }
    });
  }
}
