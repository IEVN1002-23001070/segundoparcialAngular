
import { Pipe, PipeTransform } from '@angular/core';
import { AlumnosUtl } from './alumnos';

@Pipe({
  name: 'alumnoFilter',
  standalone: true
})
export class AlumnoFilterPipe implements PipeTransform {

  transform(value: AlumnosUtl[], args: string): AlumnosUtl[] {

    const filter: string = args
      ? args.toLowerCase().trim()
      : '';

    if (!value) {
      return [];
    }

    return filter
      ? value.filter((alumno: AlumnosUtl) =>
          alumno.nombre.toLowerCase().includes(filter))
      : value;
  }
}
