
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlumnosUtl } from './alumnos';

export interface RespuestaAlumnos {
  alumnos: AlumnosUtl[];
  mensaje: string;
  exito: boolean;
}

export interface RespuestaAlumno {
  alumno: AlumnosUtl;
  mensaje?: string;
  exito: boolean;
}

export interface RespuestaOperacion {
  mensaje: string;
  exito: boolean;
  matricula?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProyectoapiAlumnosService {

  private url = 'http://127.0.0.1:5000/api/alumnos/';

  constructor(private http: HttpClient) {}

  // Consultar la lista completa
  public getAlumnos(): Observable<RespuestaAlumnos> {
    return this.http.get<RespuestaAlumnos>(this.url);
  }

  // Agregar un alumno
  public agregarNuevoAlumno(
    datos: AlumnosUtl
  ): Observable<RespuestaOperacion> {

    return this.http.post<RespuestaOperacion>(
      this.url,
      {
        ...datos,
        matricula: String(datos.matricula)
      }
    );
  }

  // Consultar un alumno por matrícula
  public getAlumno(mat: string): Observable<RespuestaAlumno> {
    return this.http.get<RespuestaAlumno>(
      `${this.url}${encodeURIComponent(mat)}`
    );
  }

  // Actualizar un alumno
  public modificarAlumno(
    mat: number,
    datos: AlumnosUtl
  ): Observable<RespuestaOperacion> {

    return this.http.put<RespuestaOperacion>(
      `${this.url}${mat}`,
      datos
    );
  }

  // Eliminar un alumno
  public EliminaAlumno(
    mat: number
  ): Observable<RespuestaOperacion> {

    return this.http.delete<RespuestaOperacion>(
      `${this.url}${mat}`
    );
  }
}
