import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonCard, IonItem, IonIcon, IonInput, IonButton, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline, mailOutline, lockClosedOutline, arrowForwardOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { PwaNotifInstallerComponent } from "../../shared/pwa-notif-installer/pwa-notif-installer.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Reemplazamos FormsModule por ReactiveFormsModule
    RouterModule,
    IonContent,
    IonCard,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonText,
    PwaNotifInstallerComponent
]
})
export class LoginComponent implements OnInit {
  // Definimos el objeto FormGroup
  loginForm!: FormGroup;
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    addIcons({ qrCodeOutline, mailOutline, lockClosedOutline, arrowForwardOutline });
  }

  ngOnInit() {
    // Inicializamos el formulario con sus respectivas validaciones reactivas
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters útiles para mostrar errores limpios en el HTML
  get emailInvalid() {
    const control = this.loginForm.get('email');
    return control ? control.invalid && control.touched : false;
  }

  get passwordInvalid() {
    const control = this.loginForm.get('password');
    return control ? control.invalid && control.touched : false;
  }
  onLogin() {
    // 1. Validar el estado del formulario reactivo
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // 2. Consumir tu API real de Node.js
    this.authService.login(this.loginForm.value).subscribe({
      next: (resp: any) => {
        localStorage.setItem('estaAutenticado', 'true');
        localStorage.setItem('token', resp.token);

        // 🌟 CORRECCIÓN 1: Guarda usando la llave 'role' para que coincida con tu backend
        localStorage.setItem('role', resp.usuario.role);

        this.authService.getLocalStorage();

        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }

        this.isLoading = false;

        // 🌟 CORRECCIÓN 2: Evalúa usando 'role' en mayúsculas
        if (resp.usuario.role === 'PROPIETARIO') {
          this.router.navigate(['/propietario/inicio']);
        } else if (resp.usuario.role === 'GUARDIA') {
          this.router.navigate(['/guardia/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      }
      ,
      error: (err) => {
        this.isLoading = false;
        console.error('Error en el login real:', err);
        // Aquí puedes desatar tus alertas de SweetAlert o Toast de Ionic:
        // Swal.fire('Error', err.error.msg || 'Credenciales inválidas', 'error');
      }
    });
  }

}
