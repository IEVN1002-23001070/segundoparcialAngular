
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MaestrosUtl } from './maestros';

export interface RespuestaMaestros {
  maestros: MaestrosUtl[];
  mensaje: string;
  exito: boolean;
}

export interface RespuestaMaestro {
  maestro: MaestrosUtl;
  mensaje?: string;
  exito: boolean;
}

export interface RespuestaOperacionMaestro {
  mensaje: string;
  exito: boolean;
  idmaestro?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProyectoapiMaestrosService {

  private url = 'http://127.0.0.1:5000/api/maestros/';

  constructor(private http: HttpClient) {}

  // GET: Consultar todos los maestros
  public getMaestros(): Observable<RespuestaMaestros> {
    return this.http.get<RespuestaMaestros>(this.url);
  }

  // POST: Agregar un nuevo maestro
  public agregarNuevoMaestro(
    datos: MaestrosUtl
  ): Observable<RespuestaOperacionMaestro> {
    return this.http.post<RespuestaOperacionMaestro>(
      this.url,
      datos
    );
  }

  // GET: Consultar un maestro por su ID
  public getMaestro(
    idmaestro: string
  ): Observable<RespuestaMaestro> {
    return this.http.get<RespuestaMaestro>(
      `${this.url}${encodeURIComponent(idmaestro)}`
    );
  }

  // PUT: Modificar un maestro
  public modificarMaestro(
    idmaestro: number,
    datos: MaestrosUtl
  ): Observable<RespuestaOperacionMaestro> {
    return this.http.put<RespuestaOperacionMaestro>(
      `${this.url}${idmaestro}`,
      datos
    );
  }

  // DELETE: Eliminar un maestro
  public EliminaMaestro(
    idmaestro: number
  ): Observable<RespuestaOperacionMaestro> {
    return this.http.delete<RespuestaOperacionMaestro>(
      `${this.url}${idmaestro}`
    );
  }
}
