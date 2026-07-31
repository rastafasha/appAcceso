import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, 
  IonCardContent, IonButton, IonIcon, IonAvatar, IonLabel 
} from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode'; 
import { addIcons } from 'ionicons';
import { carOutline, personAddOutline, shieldCheckmarkOutline, logOutOutline } from 'ionicons/icons';

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
    IonCardContent, IonButton, IonIcon, IonAvatar, IonLabel
  ]
})
export class HomeComponent implements OnInit {
  nombrePropietario: string = '';
  qrValue: string = '';

  constructor(private router: Router) {
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
    } else {
      this.logout();
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
