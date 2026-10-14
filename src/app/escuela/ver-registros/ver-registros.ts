
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

interface Venta {
  nombre: string;
  personas: number;
  tarjeta: string;
  boletos: number;
  total: number;
}

@Component({
  selector: 'app-ver-registros',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './ver-registros.html',
  styleUrl: './ver-registros.css'
})
export class VerRegistros implements OnInit {
  datos!: FormGroup;
  ventas: Venta[] = [];
  totalPagar = 0;
  mensaje = '';
  tipoMensaje = '';
  indiceEditar = -1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.datos = new FormGroup({
      nombre: new FormControl(''),
      personas: new FormControl<number | null>(null),
      tarjeta: new FormControl('no'),
      boletos: new FormControl<number | null>(null)
    });

    this.cargarVentas();
  }

  cargarVentas(): void {
    try {
      const registros = JSON.parse(
        localStorage.getItem('ventasCinepolis') || '[]'
      );

      this.ventas = Array.isArray(registros) ? registros : [];
    } catch {
      this.ventas = [];
      this.mostrarMensaje(
        'No se pudieron cargar los registros guardados.',
        'error'
      );
    }
  }

  procesar(): void {
    const nombre = String(this.datos.value.nombre || '').trim();
    const personas = Number(this.datos.value.personas);
    const boletos = Number(this.datos.value.boletos);
    const tarjeta = this.datos.value.tarjeta;

    this.totalPagar = 0;
    this.mensaje = '';
    this.tipoMensaje = '';

    if (nombre === '') {
      this.mostrarMensaje(
        'Escribe el nombre de quien realiza la compra.',
        'error'
      );
      return;
    }

    if (
      this.datos.value.personas === null ||
      this.datos.value.personas === '' ||
      this.datos.value.boletos === null ||
      this.datos.value.boletos === '' ||
      !Number.isInteger(personas) ||
      personas < 1 ||
      !Number.isInteger(boletos) ||
      boletos < 1
    ) {
      this.mostrarMensaje(
        'Ingresa una cantidad válida de personas y boletos.',
        'error'
      );
      return;
    }

    if (boletos > personas * 7) {
      this.mostrarMensaje(
        'Solo se permiten 7 boletos por persona.',
        'error'
      );
      return;
    }

    let total = boletos * 12;

    if (boletos >= 3 && boletos <= 5) {
      total *= 0.90;
    } else if (boletos > 5) {
      total *= 0.85;
    }

    if (tarjeta === 'si') {
      total *= 0.90;
    }

    this.totalPagar = Math.round(total * 100) / 100;

    const venta: Venta = {
      nombre,
      personas,
      tarjeta,
      boletos,
      total: this.totalPagar
    };

    const indiceAnterior = this.indiceEditar;
    const ventasAnteriores = [...this.ventas];

    if (indiceAnterior === -1) {
      this.ventas.push(venta);
    } else {
      this.ventas[indiceAnterior] = venta;
    }

    try {
      localStorage.setItem(
        'ventasCinepolis',
        JSON.stringify(this.ventas)
      );

      this.mostrarMensaje(
        indiceAnterior === -1
          ? '¡Compra guardada correctamente!'
          : '¡Registro actualizado correctamente!',
        'exito'
      );

      this.limpiarFormulario();
    } catch {
      this.ventas = ventasAnteriores;
      this.totalPagar = 0;

      this.mostrarMensaje(
        'No se pudieron guardar los cambios. Inténtalo de nuevo.',
        'error'
      );
    }
  }

  editar(indice: number): void {
    const venta = this.ventas[indice];

    if (!venta) {
      return;
    }

    this.indiceEditar = indice;
    this.totalPagar = venta.total;

    this.datos.patchValue({
      nombre: venta.nombre,
      personas: venta.personas,
      tarjeta: venta.tarjeta,
      boletos: venta.boletos
    });

    this.mostrarMensaje(
      'Modifica los datos del formulario y guarda los cambios.',
      'exito'
    );
  }

  eliminar(indice: number): void {
    if (!this.ventas[indice]) {
      return;
    }

    if (confirm('¿Seguro que quieres eliminar este registro?')) {
      const ventasAnteriores = [...this.ventas];
      const indiceEnEdicion = this.indiceEditar;

      this.ventas.splice(indice, 1);

      if (indiceEnEdicion === indice) {
        this.indiceEditar = -1;
      } else if (indiceEnEdicion > indice) {
        this.indiceEditar--;
      }

      try {
        localStorage.setItem(
          'ventasCinepolis',
          JSON.stringify(this.ventas)
        );

        if (indiceEnEdicion === indice) {
          this.limpiarFormulario();
        }

        this.mostrarMensaje(
          'Registro eliminado correctamente.',
          'exito'
        );
      } catch {
        this.ventas = ventasAnteriores;
        this.indiceEditar = indiceEnEdicion;

        this.mostrarMensaje(
          'No se pudo eliminar el registro. Inténtalo de nuevo.',
          'error'
        );
      }
    }
  }

  cancelar(): void {
    this.limpiarFormulario();
    this.mostrarMensaje('Edición cancelada.', 'exito');
  }

  limpiarFormulario(): void {
    this.indiceEditar = -1;
    this.totalPagar = 0;

    this.datos.reset({
      nombre: '',
      personas: null,
      tarjeta: 'no',
      boletos: null
    });
  }

  mostrarMensaje(texto: string, tipo: string): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
  }

  volver(): void {
    this.router.navigate(['/escuela/cinepolis']);
  }
}
