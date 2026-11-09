
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { MaestrosUtl } from '../maestros';
import { ProyectoapiMaestrosService } from '../proyectoapimaestros.service';

@Component({
  selector: 'app-agregar-maestro',
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
    public maestrosUtl: ProyectoapiMaestrosService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formGroup = this.initForm();
  }

  initForm(): FormGroup {
    return this.fb.group({
      idmaestro: [
        null,
        [Validators.required, Validators.min(1)]
      ],
      nombre: ['', Validators.required],
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      correo: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  onSubmit(): void {

    if (this.formGroup.invalid || this.guardando) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const valores = this.formGroup.getRawValue();

    const datos: MaestrosUtl = {
      idmaestro: Number(valores.idmaestro),
      nombre: String(valores.nombre).trim(),
      apaterno: String(valores.apaterno).trim(),
      amaterno: String(valores.amaterno).trim(),
      correo: String(valores.correo).trim()
    };

    if (
      !Number.isSafeInteger(datos.idmaestro) ||
      datos.idmaestro <= 0 ||
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

    this.maestrosUtl.agregarNuevoMaestro(datos).subscribe({

      next: (respuesta) => {

        this.guardando = false;

        if (respuesta.exito) {

          alert('Maestro registrado correctamente');

          this.router.navigate(['/utl/maestros']);

        } else {
          this.mensaje =
            respuesta.mensaje ||
            'No se pudo registrar el maestro.';
        }

        this.cd.markForCheck();
      },

      error: (error) => {

        this.guardando = false;

        console.error('Error al registrar maestro:', error);

        this.mensaje =
          error.error?.mensaje ||
          'Ocurrió un error al registrar el maestro.';

        this.cd.markForCheck();
      }
    });
  }
}
