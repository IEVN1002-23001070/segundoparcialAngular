
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

import {
  Router,
  RouterLink,
  ActivatedRoute
} from '@angular/router';

import { timeout, finalize } from 'rxjs';

import { MaestrosUtl } from '../maestros';
import { ProyectoapiMaestrosService } from '../proyectoapimaestros.service';

@Component({
  selector: 'app-editar-maestro',
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

  idmaestro: string = '';
  mensaje: string = '';

  cargando: boolean = false;
  guardando: boolean = false;
  maestroCargado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public maestrosUtl: ProyectoapiMaestrosService,
    private fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.formulario = this.fb.group({
      idmaestro: [{ value: '', disabled: true }],
      nombre: ['', Validators.required],
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      correo: ['', [
        Validators.required,
        Validators.email
      ]]
    });

    this.idmaestro =
      this.route.snapshot.paramMap.get('idmaestro') || '';

    if (
      !/^[1-9]\d*$/.test(this.idmaestro) ||
      !Number.isSafeInteger(Number(this.idmaestro))
    ) {
      this.mensaje = 'ID del maestro no válido.';
      return;
    }

    this.cargarMaestro();
  }

  cargarMaestro(): void {

    this.cargando = true;
    this.maestroCargado = false;
    this.mensaje = '';

    this.maestrosUtl.getMaestro(this.idmaestro)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.cargando = false;
          this.cd.markForCheck();
        })
      )
      .subscribe({

        next: (response) => {

          if (response.exito && response.maestro) {

            this.formulario.patchValue(response.maestro);
            this.maestroCargado = true;

          } else {

            this.mensaje =
              response.mensaje ||
              'Maestro no encontrado.';
          }

          this.cd.markForCheck();
        },

        error: (error) => {

          console.error('Error al consultar maestro:', error);

          if (error.name === 'TimeoutError') {
            this.mensaje =
              'Flask tardó demasiado en responder.';
          } else if (error.status === 0) {
            this.mensaje =
              'No se pudo conectar con Flask.';
          } else {
            this.mensaje =
              error.error?.mensaje ||
              'No se pudieron cargar los datos del maestro.';
          }

          this.cd.markForCheck();
        }
      });
  }

  onSubmit(): void {

    if (
      this.formulario.invalid ||
      this.guardando ||
      this.cargando ||
      !this.maestroCargado
    ) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    const datos: MaestrosUtl = {
      idmaestro: Number(this.idmaestro),
      nombre: String(valores.nombre).trim(),
      apaterno: String(valores.apaterno).trim(),
      amaterno: String(valores.amaterno).trim(),
      correo: String(valores.correo).trim()
    };

    if (
      !datos.nombre ||
      !datos.apaterno ||
      !datos.amaterno ||
      !datos.correo
    ) {
      this.mensaje = 'Todos los campos son obligatorios.';
      this.cd.markForCheck();
      return;
    }

    this.guardando = true;
    this.mensaje = '';

    this.maestrosUtl.modificarMaestro(
      datos.idmaestro,
      datos
    ).subscribe({

      next: (respuesta) => {

        this.guardando = false;

        if (respuesta.exito) {

          alert('Maestro actualizado correctamente');

          this.router.navigate(['/utl/maestros']);

        } else {
          this.mensaje =
            respuesta.mensaje ||
            'No se pudo modificar el maestro.';
        }

        this.cd.markForCheck();
      },

      error: (error) => {

        this.guardando = false;

        console.error('Error al modificar maestro:', error);

        this.mensaje =
          error.error?.mensaje ||
          'Ocurrió un error al modificar el maestro.';

        this.cd.markForCheck();
      }
    });
  }
}
