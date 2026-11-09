
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout, finalize } from 'rxjs';

import { MaestrosUtl } from '../maestros';
import { MaestroFilterPipe } from '../maestros-filter.pipe';
import { ProyectoapiMaestrosService } from '../proyectoapimaestros.service';

@Component({
  selector: 'app-maestros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MaestroFilterPipe
  ],
  templateUrl: './maestros.html',
  styleUrl: './maestros.css'
})
export class Maestros implements OnInit {

  listFilter: string = '';
  mensaje: string = '';
  cargando: boolean = false;

  maestrosIric: MaestrosUtl[] = [];

  dataSource: { maestros: MaestrosUtl[] } = {
    maestros: []
  };

  constructor(
    public maestrosUtl: ProyectoapiMaestrosService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMaestros();
  }

  cargarMaestros(): void {

    this.cargando = true;
    this.mensaje = '';

    this.maestrosUtl.getMaestros()
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
            Array.isArray(response.maestros)
          ) {
            this.dataSource.maestros = response.maestros;
            this.maestrosIric = response.maestros;
          } else {
            this.mensaje =
              response.mensaje ||
              'No se pudieron cargar los maestros.';
          }

          this.cd.markForCheck();
        },

        error: (error) => {

          console.error('Error al consultar maestros:', error);

          if (error.name === 'TimeoutError') {
            this.mensaje =
              'Flask tardó demasiado en responder.';
          } else if (error.status === 0) {
            this.mensaje =
              'No se pudo conectar con Flask.';
          } else {
            this.mensaje =
              error.error?.mensaje ||
              'Error al consultar maestros.';
          }

          this.cd.markForCheck();
        }
      });
  }
}
