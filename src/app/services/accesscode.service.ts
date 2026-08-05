import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AccessCode } from '../models/accesscode';

const baseUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class AccesscodeService {

  public accesocode?: AccessCode;

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  generarVisita(accesocode: any) {
    const url = `${baseUrl}/accessqr/generar-visita`;
    return this.http.post(url, accesocode, this.headers);
  }

  verificarPuerta(accesocode: any) {
    const url = `${baseUrl}/accessqr/verificar-puerta`;
    return this.http.post(url, accesocode, this.headers);
  }

   getVisitasUser(propietarioId: string) {
    const url = `${baseUrl}/accessqr/visitas_propietario/${propietarioId}`;
    return this.http.get<any>(url, this.headers)
  }
   getBitacoraHoy() {
    const url = `${baseUrl}/accessqr/bitacora-hoy`;
    return this.http.get<any>(url, this.headers)
  }

   deleteCode(_id: string) {
    const url = `${baseUrl}/accessqr/borrarv/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
