
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cinepolis',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './cinepolis.html',
  styleUrl: './cinepolis.css'
})
export class Cinepolis implements OnInit {
  datos!: FormGroup;
  totalPagar = 0;
  mensaje = '';
  tipoMensaje = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.datos = new FormGroup({
      nombre: new FormControl(''),
      personas: new FormControl<number | null>(null),
      tarjeta: new FormControl('no'),
      boletos: new FormControl<number | null>(null)
    });
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

    const precioBoleto = 12;
    let total = boletos * precioBoleto;

    if (boletos >= 3 && boletos <= 5) {
      total *= 0.90;
    } else if (boletos > 5) {
      total *= 0.85;
    }

    if (tarjeta === 'si') {
      total *= 0.90;
    }

    this.totalPagar = Math.round(total * 100) / 100;

    const venta = {
      nombre,
      personas,
      tarjeta,
      boletos,
      total: this.totalPagar
    };

    try {
      const ventasGuardadas = JSON.parse(
        localStorage.getItem('ventasCinepolis') || '[]'
      );

      if (!Array.isArray(ventasGuardadas)) {
        throw new Error('Los registros guardados no son válidos.');
      }

      ventasGuardadas.push(venta);

      localStorage.setItem(
        'ventasCinepolis',
        JSON.stringify(ventasGuardadas)
      );

      this.mostrarMensaje(
        '¡Compra procesada y guardada correctamente!',
        'exito'
      );
    } catch {
      this.totalPagar = 0;
      this.mostrarMensaje(
        'No se pudo guardar la compra. Inténtalo de nuevo.',
        'error'
      );
    }
  }

  mostrarMensaje(texto: string, tipo: string): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
  }

  verRegistros(): void {
    this.router.navigate(['/escuela/ver-registros']);
  }
}
