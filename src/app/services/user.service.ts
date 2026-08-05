import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

import { RegisterForm } from '../auth/interfaces/register-form.interface';
import { LoginForm } from '../auth/interfaces/login-form.interface';
import { CargarUsuario } from '../auth/interfaces/cargar-usuarios.interface';

import {tap, map, catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';

declare const gapi: any;

const base_url = environment.apiUrl;
const userGoogle = environment.clientGoogle

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public auth2: any;
  public usuario?: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
    ) {
      // this.googleInit();
  }

  get token():string{
    return localStorage.getItem('token') || '';
  }

  // get role(): 'PROPIETARIO' | 'ADMIN' | 'GUARDIA' | 'VISITA' {
  //   return this.usuario?.role;
  // }

  get uid():string{
    return this.usuario?.uid || '';
  }

  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }



  actualizarPerfil(data: {email: string, nombre: string, role: string}){

    data = {
      ...data,
      // role: this.usuario?.role
    }

    return this.http.put(`${base_url}/usuarios/editar/${this.uid}`, data, this.headers);
  }

  update(user: User){
    return this.http.put(`${base_url}/usuarios/editar/${user}`,this.headers);
  }

  cargarUsuarios(desde: number = 0){

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map( resp =>{
          const usuarios = resp.usuarios.map(
            user => new User(
              user.first_name,
              user.last_name,
              user.email,
              user.numdoc,
              user.telefono,
              user.activo,
              '',
              user.role,
              user.uid
            ));

          return {
            total: resp.total,
            usuarios

          }
        })
      )
  }

  getUserById(_id: any)  {
    const url = `${base_url}/usuarios/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, usuario: User}) => resp.usuario)
        );
  }
  getUsuarios()  {
    const url = `${base_url}/usuarios/all`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, usuarios: User}) => resp.usuarios)
      )
  }
  getRecientes()  {
    const url = `${base_url}/usuarios/recientes`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, usuarios: User}) => resp.usuarios)
      )
  }

  getAllEditors()  {
    const url = `${base_url}/usuarios/editores`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, editores: User}) => resp.editores)
      )
  }


  deleteById(usuario: User){
    const url = `${base_url}/usuarios/delete/${usuario}`;
    return this.http.delete(url, this.headers)
  }


  editarRole(usuario: User){
    return this.http.put(`${base_url}/usuarios/editarRole/${usuario.uid}`, usuario, this.headers);
  }


 
  searchUsers(usuario:any):Observable<any>{

    const url = `${base_url}/todo/coleccion/usuarios/${usuario}`;
    return this.http.get<any>(url, this.headers)
  }
  

}