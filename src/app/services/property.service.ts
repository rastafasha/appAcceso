import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Property } from '../models/property';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  public property?: Property;
  

  constructor(private http: HttpClient) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }


  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }


  getProperties() {
    const url = `${baseUrl}/categorias`;
    return this.http.get<any>(url,this.headers)
      .pipe(
        map((resp:{ok: boolean, properties: Property}) => resp.properties)
      )
  }


  getProperty(_id: string) {
    const url = `${baseUrl}/property/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, property: Property}) => resp.property)
        );
  }

  getPropertyUser(propietarioId: string) {
    const url = `${baseUrl}/property/user/${propietarioId}`;
    return this.http.get<any>(url, this.headers)
      // .pipe(
      //   map((resp:{ok: boolean, property: Property}) => resp.property)
      //   );
  }


  createProperty(property: Property) {
    const url = `${baseUrl}/property/crear`;
    return this.http.post(url, property, this.headers);
  }

  updateProperty(property:Property) {
    const url = `${baseUrl}/property/update/${property._id}`;
    return this.http.put(url, property, this.headers);
  }

  deleteProperty(_id: string) {
    const url = `${baseUrl}/property/borrar/${_id}`;
    return this.http.delete(url, this.headers);
  }


   addVehiculo(property:Property) {
    const url = `${baseUrl}/property/addv/${property._id}`;
    return this.http.put(url, property, this.headers);
  }

  deleteVehiculo(_id: string, vehiculoId:string) {
    const url = `${baseUrl}/property/borrarv/${_id}/vehiculo/${vehiculoId}`;
    return this.http.delete(url, this.headers);
  }

  

  
}
