
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink,
  ActivatedRoute
} from '@angular/router';

import { timeout, finalize } from 'rxjs';

import { MaestrosUtl } from '../maestros';
import { ProyectoapiMaestrosService } from '../proyectoapimaestros.service';

@Component({
  selector: 'app-eliminar-maestro',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './eliminar.html'
})
export class Eliminar implements OnInit {

  idmaestro: string = '';

  maestro: MaestrosUtl | null = null;

  mensaje: string = '';
  cargando: boolean = false;
  eliminando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public maestrosUtl: ProyectoapiMaestrosService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

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
    this.mensaje = '';
    this.maestro = null;

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

            this.maestro = response.maestro;

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
              'No se pudo obtener la información del maestro.';
          }

          this.cd.markForCheck();
        }
      });
  }

  confirmarEliminar(): void {

    if (!this.maestro || this.eliminando || this.cargando) {
      return;
    }

    this.eliminando = true;
    this.mensaje = '';

    this.maestrosUtl.EliminaMaestro(
      this.maestro.idmaestro
    ).subscribe({

      next: (respuesta) => {

        this.eliminando = false;

        if (respuesta.exito) {

          alert('Maestro eliminado correctamente');

          this.router.navigate(['/utl/maestros']);

        } else {

          this.mensaje =
            respuesta.mensaje ||
            'No se pudo eliminar el maestro.';
        }

        this.cd.markForCheck();
      },

      error: (error) => {

        this.eliminando = false;

        console.error('Error al eliminar maestro:', error);

        this.mensaje =
          error.error?.mensaje ||
          'Ocurrió un error al eliminar el maestro.';

        this.cd.markForCheck();
      }
    });
  }
}
