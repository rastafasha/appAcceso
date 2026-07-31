import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonCard, IonItem, IonIcon, IonInput, IonButton, IonText 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, phonePortraitOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonCard,
    IonItem,
    IonIcon,
    IonText,
    IonButton,
    IonInput
]
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  isLoading = false;
  errors: any = null;
  
  constructor(private fb: FormBuilder,
     private router: Router, 
     private authService: AuthService,) 
     {
    addIcons({ personOutline, mailOutline, lockClosedOutline, phonePortraitOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.registroForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      numdoc: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]], // Acepta números de 8 a 15 dígitos
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator // Validador personalizado para emparejar contraseñas
    });
  }

  // Validador personalizado para confirmar contraseñas
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Getters para manejo de errores visuales en el HTML
  isInvalid(field: string): boolean {
    const control = this.registroForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  get passwordsDoNotMatch(): boolean {
    const control = this.registroForm;
    return control.hasError('passwordsMismatch') && control.get('confirmPassword')?.touched || false;
  }

  onRegistro() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    // Extraemos la data limpia del formulario lista para enviar a MongoDB Atlas
    const { first_name, last_name, email,numdoc, telefono, password } = this.registroForm.value;
    
    const payloadNode = { first_name, last_name, email,numdoc, telefono, password, role: 'PROPIETARIO' };
    console.log('Payload de registro listo para tu API Node.js:', payloadNode);
    this.isLoading = true;
    this.authService.crearUsuario(this.registroForm.value).subscribe(
      resp => {
        this.isLoading = false;
        // Swal.fire('Registrado!', `Ya puedes ingresar`, 'success');

        window.location.reload();
      }, (error) => {
        this.isLoading = false;
        // Swal.fire('Error', error.error.msg, 'error');
        this.errors = error.error;
      }
    );

    // Aquí llamarías a tu servicio HTTP. Al ser exitoso, redirigimos al Login:
    this.router.navigate(['/login']);
  }
}
