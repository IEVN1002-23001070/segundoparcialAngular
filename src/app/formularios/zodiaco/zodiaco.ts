import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zodiaco',
  imports: [FormsModule, CommonModule],
  templateUrl: './zodiaco.html'
})

export class Zodiaco {

  nombre:string='';
  apellidoP:string='';
  apellidoM:string='';

  dia:number=0;
  mes:number=0;
  anio:number=0;

  sexo:string='';

  edad:number=0;
  signo:string='';
  imagen:string='';

  muestraResultado:boolean=false;

  imageWidth:number=100;
  imageMargin:number=2;


  signos:any[]=[

    {
      nombre:'Mono',
      imagen:'signos/mono.png'
    },

    {
      nombre:'Gallo',
      imagen:'signos/gallo.png'
    },

    {
      nombre:'Perro',
      imagen:'signos/perro.png'
    },

    {
      nombre:'Cerdo',
      imagen:'signos/cerdo.png'
    },

    {
      nombre:'Rata',
      imagen:'signos/rata.png'
    },

    {
      nombre:'Buey',
      imagen:'signos/buey.png'
    },

    {
      nombre:'Tigre',
      imagen:'signos/tigre.png'
    },

    {
      nombre:'Conejo',
      imagen:'signos/conejo.png'
    },

    {
      nombre:'Dragon',
      imagen:'signos/dragon.png'
    },

    {
      nombre:'Serpiente',
      imagen:'signos/serpiente.png'
    },

    {
      nombre:'Caballo',
      imagen:'signos/caballo.png'
    },

    {
      nombre:'Cabra',
      imagen:'signos/cabra.png'
    }

  ];


  imprimir():void{

    let fecha=new Date();

    this.edad=fecha.getFullYear()-this.anio;

    if(fecha.getMonth()+1<this.mes ||
      (fecha.getMonth()+1==this.mes && fecha.getDate()<this.dia)){
      this.edad--;
    }

    let resto=this.anio%12;

    this.signo=this.signos[resto].nombre;
    this.imagen=this.signos[resto].imagen;

    this.muestraResultado=true;
  }

}