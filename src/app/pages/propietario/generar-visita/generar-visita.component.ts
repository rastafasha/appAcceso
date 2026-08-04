import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonModal, IonText } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { personOutline, carOutline, calendarOutline, checkmarkCircleOutline, arrowBackOutline } from 'ionicons/icons';
import { AccesscodeService } from '../../../services/accesscode.service';
import { AuthService } from '../../../services/auth.service';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-generar-visita',
  templateUrl: './generar-visita.component.html',
  styleUrls: ['./generar-visita.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonItem,
    IonLabel, IonInput, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonModal,
    IonText
  ]
})
export class GenerarVisitaComponent implements OnInit {
  visitaForm!: FormGroup;
  isLoading = false;
  propietarioId = '';
  user: any;
  propiedad: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private accesscodeService: AccesscodeService,
    private authService: AuthService,
    private propertyService: PropertyService,

  ) {
    addIcons({ personOutline, carOutline, calendarOutline, checkmarkCircleOutline, arrowBackOutline });
  }

  ngOnInit() {
    this.user = this.authService.usuario;

    // 1. Calculamos la fecha actual (Desde)
    const ahora = new Date();

    // 2. Calculamos 3 horas en el futuro (Hasta)
    const tresHorasDespues = new Date();
    tresHorasDespues.setHours(ahora.getHours() + 3);

    this.visitaForm = this.fb.group({
      nombreVisita: ['', [Validators.required, Validators.minLength(3)]],
      idVisita: ['', [Validators.required, Validators.minLength(3)]],
      // Inicializamos ambos campos con strings en formato ISO válidos
      validoDesde: [ahora.toISOString(), Validators.required],
      validoHasta: [tresHorasDespues.toISOString(), Validators.required],

      placa: [''],
      modelo: [''],
      color: ['']
    });
    this.cargarDatosPropiedad()
  }

  cargarDatosPropiedad() {
    this.propertyService.getPropertyUser(this.user.uid)
      .subscribe({
        next: (resp: any) => {
          if (resp.ok && resp.property) {
            this.propiedad = resp.property;
          } 
        },
        error: (err) => console.error('Error al cargar propiedad:', err)
      });
  }

  // Validación rápida visual
  isInvalid(field: string): boolean {
    const control = this.visitaForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  crearPaseVisita() {
    if (this.visitaForm.invalid) {
      this.visitaForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValues = this.visitaForm.value;

    // 3. Estructurar el Payload exactamente como lo espera tu Controller de Node.js
    const payloadVisita = {
      propietarioId: this.user.uid,
      propiedadId: this.propiedad._id, // Reemplaza dinámicamente con la propiedad real del dueño
      nombreVisita: formValues.nombreVisita,
      idVisita: formValues.idVisita,
      validoDesde: formValues.validoDesde,
      validoHasta: formValues.validoHasta,
      // Mapeamos el carro
      placa: formValues.placa,
      modelo: formValues.modelo,
      color: formValues.color
    };

    console.log('Enviando pase temporal a Node.js:', payloadVisita);

    this.accesscodeService.generarVisita(payloadVisita).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if (resp.success) {
          console.log('Token de visita generado por Node.js:', resp.token);

          // Navegamos de regreso al historial compartiendo el token recién creado
          // Puedes pasarlo por parámetros de ruta o guardarlo temporalmente
          this.router.navigate(['/propietario/visitas'], { queryParams: { token: resp.token } });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al crear el pase:', err);
      }
    });

    // 4. Petición POST a tu API real


  }
}
