import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonButton, IonIcon, IonAvatar, IonLabel, IonItem, IonSelect, IonSelectOption, IonInput } from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode'; 
import { addIcons } from 'ionicons';
import { carOutline, personAddOutline, shieldCheckmarkOutline, logOutOutline } from 'ionicons/icons';
import { PropertyService } from '../../../services/property.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    QRCodeComponent, // Importamos la directiva del QR
    IonContent, IonHeader, IonToolbar, IonTitle, IonCard,
    IonCardContent, IonButton, IonIcon, IonAvatar, IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput, FormsModule
]
})
export class HomeComponent implements OnInit {
 

  nombrePropietario: string = '';
  propietarioId = '';
  vehiculosFijos: any[] = []; // Almacenará los carros traídos de MongoDB Atlas

  // Variables reactivas de selección
  vehiculoSeleccionado: string = 'CAMINANDO'; // Valor por defecto
  placaTemporal: string = '';
  qrValue: string = '';

  constructor(
    private router: Router,
    private propertyService: PropertyService,

  ) {
    addIcons({ carOutline, personAddOutline, shieldCheckmarkOutline, logOutOutline });
  }

  ngOnInit() {
    this.cargarDatosResidente();
  }

  cargarDatosResidente() {
    const usuarioJSON = localStorage.getItem('usuario'); 
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      this.nombrePropietario = `${usuario.first_name} ${usuario.last_name}`;
      this.qrValue = usuario.uid; // "6a6cccfd412b70e8a5e20b57"
      this.propietarioId = usuario.uid;
      // 1. Consultar a Node.js la lista de vehículos fijos del perfil de este usuario
      this.obtenerVehiculosDelPerfil();
    } else {
      this.logout();
    }
  }

  obtenerVehiculosDelPerfil() {
    // Usamos el endpoint GET corregido con findOne que busca por el ID del dueño
    this.propertyService.getPropertyUser(this.propietarioId)
      .subscribe({
        next: (resp: any) => {
          if (resp.ok && resp.property) {
            this.vehiculosFijos = resp.property.vehiculosPropietario || [];
          }
          // 2. Una vez que la lista carga (o si está vacía), armamos el QR inicial
          this.actualizarCodigoQR();
        },
        error: (err) => {
          console.error('Error al traer vehículos para el selector:', err);
          this.actualizarCodigoQR(); // Fallback de contingencia
        }
      });
  }

  // Cada vez que el propietario cambia el selector, recalculamos la cadena del QR instantáneamente
  actualizarCodigoQR() {
    let placaPase = 'PEATONAL'; // Por defecto si sale caminando
    
    if (this.vehiculoSeleccionado === 'OTRO') {
      placaPase = this.placaTemporal.trim().toUpperCase() || 'OTRO_VEHICULO';
    } else if (this.vehiculoSeleccionado !== 'CAMINANDO') {
      placaPase = this.vehiculoSeleccionado.toUpperCase(); // Contiene la placa de un carro fijo seleccionado
    }

    // Unimos los dos datos usando el separador "|" para que el backend pueda desarmarlo con un .split('|')
    this.qrValue = `${this.propietarioId}|${placaPase}`;
    console.log('Firma del QR actualizada para la portería:', this.qrValue);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
