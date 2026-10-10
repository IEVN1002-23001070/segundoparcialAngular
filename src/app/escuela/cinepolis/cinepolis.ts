
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cinepolis',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cinepolis.html'
})
export class Cinepolis implements OnInit {

  datos!: FormGroup;

  totalPagar = 0;

  ngOnInit(): void {
    this.datos = new FormGroup({
      nombre: new FormControl(''),
      personas: new FormControl(0),
      tarjeta: new FormControl('no'),
      boletos: new FormControl(0)
    });
  }

  procesar(): void {
    let personas = Number(this.datos.value.personas);
    let boletos = Number(this.datos.value.boletos);
    let total = boletos * 12;

    if (personas <= 0 || boletos <= 0 || boletos > personas * 7) {
      this.totalPagar = 0;
      return;
    }

    if (boletos > 5) {
      total = total * 0.85;
    } else if (boletos >= 3) {
      total = total * 0.90;
    }

    if (this.datos.value.tarjeta === 'si') {
      total = total * 0.90;
    }

    this.totalPagar = total;
  }

  salir(): void {
    this.datos.reset({
      nombre: '',
      personas: 0,
      tarjeta: 'no',
      boletos: 0
    });

    this.totalPagar = 0;
  }
}
