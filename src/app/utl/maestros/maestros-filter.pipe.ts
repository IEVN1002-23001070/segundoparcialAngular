
import { Pipe, PipeTransform } from '@angular/core';
import { MaestrosUtl } from './maestros';

@Pipe({
  name: 'maestroFilter',
  standalone: true
})
export class MaestroFilterPipe implements PipeTransform {

  transform(value: MaestrosUtl[], args: string): MaestrosUtl[] {

    let filter: string = args ? args.toLowerCase().trim() : '';

    return filter
      ? value.filter((maestro: MaestrosUtl) =>
          maestro.nombre.toLowerCase().indexOf(filter) !== -1)
      : value;
  }
}
