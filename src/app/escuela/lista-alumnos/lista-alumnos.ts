import { Component } from '@angular/core';
import { IAlumno } from '../alumnos';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms'

@Component({
  imports: [FormsModule, ReactiveFormsModule],
  selector: 'app-lista-alumnos',
  styleUrl: './lista-alumnos.css',
  templateUrl: './lista-alumnos.html',
})
export class ListaAlumnos implements OnInit {
  formulario!:FormGroup

  alumnos:IAlumno[]=[]
  nuevoAlumno:IAlumno={
    matricula:'',
    nombre:'',
    correo:'',
    materia:''
  }
ngOnInit(): void {
  this.cargarAlumno()
  this.formulario=new FormGroup({
    matricula: new FormControl(''),
    nombre: new FormControl(''),
    correo: new FormControl(''),
    materia: new FormControl(''),
  })
}
}
