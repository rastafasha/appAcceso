import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { RegisterForm } from '../auth/interfaces/register-form.interface';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public usuario: User | null = null;
  public estaAutenticado = false;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public auth2: any;

  constructor(
    private router: Router,
    public http: HttpClient
  ) {
    this.getLocalStorage();//devuelve el usuario logueado
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  // get role(): 'PROPIETARIO' | 'ADMIN' | 'GUARDIA' | 'VISITA' {
  //   return this.usuario?.role;
  // }

  get uid(): string {
    return this.usuario?.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage(token: string, userData: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(userData));
    this.getLocalStorage();  // Populate service state and emit
  }

  getLocalStorage(): User | null {
    const authStr = localStorage.getItem('estaAutenticado');
    this.estaAutenticado = authStr === 'true';


    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('usuario');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Create User instance from parsed data (match JSON shape)
        this.usuario = new User(
          userData.first_name || '',
          userData.last_name || '',
          userData.numdoc || '',
          userData.telefono || '',
          userData.email || '',
          userData.activo || false,
          undefined,  // password not stored
          userData.role,
          userData.uid,
          userData.createdAt ? new Date(userData.createdAt) : undefined,
          userData.updatedAt ? new Date(userData.updatedAt) : undefined
        );
        this.currentUserSubject.next(this.usuario);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        this.usuario = null;
        this.currentUserSubject.next(null);
      }
    } else {
      this.usuario = null;
      this.currentUserSubject.next(null);
    }

    return this.usuario;
  }

  getEstaAutenticado(): boolean {
    return this.estaAutenticado;
  }

  login(formData: any) {
    return this.http.post(`${baseUrl}/auth/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('estaAutenticado', 'true');
          this.guardarLocalStorage(resp.token, resp.usuario);
        })
      )
  }

  logout() {
    this.currentUserSubject.next(null);
    this.refresh();
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('estaAutenticado');
    localStorage.removeItem('cart');
    this.usuario = null;
    this.estaAutenticado = false;
    this.router.navigateByUrl('./login');
  }

  refresh(): void {
    window.location.reload();
    this.router.navigateByUrl('/home');
  }

crearUsuario(formData: RegisterForm){
    return this.http.post(`${baseUrl}/usuarios/crear`, formData)
    .pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.usuario);
      })
    )
  }

  closeMenu() {
    var menuLateral = document.getElementsByClassName("sidebar");
    for (var i = 0; i < menuLateral.length; i++) {
      menuLateral[i].classList.remove("active");
    }
  }

  getLocalDarkMode() {
    if (localStorage.getItem('darkmode')) {
      var element = document.body;
      element.classList.add("darkmode");
    }
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${baseUrl}/auth/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { 
          first_name, last_name,  
          numdoc, email,  
          telefono, activo,  
          role, uid 
        } = resp.usuario;

        this.usuario = new User(
          first_name, last_name,  
          numdoc, email,  
          telefono, activo,    
          undefined,  role, uid);
        this.guardarLocalStorage(resp.token, resp.usuario);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  set_recovery_token(email:string): Observable<any> {

    const url = `${baseUrl}/usuarios/user_token/set/${email}`;
    return this.http.get<any>(url, this.headers)
  }


  verify_token(email:string, codigo:string): Observable<any> {
    const url = `${baseUrl}/usuarios/user_verify/token/${email}/${codigo}`;
    return this.http.get<any>(url, this.headers)
  }

  change_password(email:string, data:string): Observable<any> {
    debugger
    const url = `${baseUrl}/usuarios/user_password/change/${email}/${data}`;
    return this.http.put<any>(url, this.headers)
  }
  forgotPassword(data:string): Observable<any> {
    debugger
    const url = `${baseUrl}/usuarios/user_password/change/${data}`;
    return this.http.put<any>(url, this.headers)
  }




}
