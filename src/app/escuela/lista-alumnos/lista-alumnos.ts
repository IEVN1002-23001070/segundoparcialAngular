import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

export interface IAlumnos {
  matricula: string;
  nombre: string;
  correo: string;
  materia: string;
}

@Component({
  selector: 'app-listaAlumnos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './lista-alumnos.html'
})
export class ListaAlumnos implements OnInit {

  formulario!: FormGroup;

  alumnos: IAlumnos[] = [];

  nuevoAlumno: IAlumnos = {
    matricula: 'xx',
    nombre: 'xx',
    correo: 'xx',
    materia: 'xx'
  };

  ngOnInit(): void {
    this.formulario = new FormGroup({
      matricula: new FormControl(''),
      nombre: new FormControl(''),
      correo: new FormControl(''),
      materia: new FormControl('')
    });
  }

  muestraAlumnos():void{
    this.nuevoAlumno.matricula=this.formulario.value.matricula
    this.nuevoAlumno.nombre=this.formulario.value.nombre
    this.nuevoAlumno.correo=this.formulario.value.correo
    this.nuevoAlumno.materia=this.formulario.value.materia
  }
}