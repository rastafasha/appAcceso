import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, 
  IonButton, IonIcon, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonBadge 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanOutline, carOutline, peopleOutline, logOutOutline, timeOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { AccesscodeService } from '../../../services/accesscode.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, 
    IonButton, IonIcon, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonBadge
  ]
})
export class DashboardComponent implements OnInit {
  nombreGuardia = '';
  ultimosAccesos: any[] = [];
  
  // Contadores analíticos para el turno
  totalPropietarios = 0;
  totalVisitas = 0;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private accessCodeService: AccesscodeService,
  ) {
    addIcons({ scanOutline, carOutline, peopleOutline, logOutOutline, timeOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      this.nombreGuardia = `${usuario.first_name} ${usuario.last_name}`;
    }
    this.cargarResumenTurno();
  }

  // Evento nativo de Ionic que se dispara cada vez que la vista se vuelve activa
  ionViewWillEnter() {
    this.cargarResumenTurno();
  }

  cargarResumenTurno() {
  this.accessCodeService.getBitacoraHoy().subscribe({
    next: (resp: any) => {
      if (resp.ok) {
        // Almacenamos los resultados reales de MongoDB Atlas
        this.ultimosAccesos = resp.accesos.slice(0, 3); // Feed rápido de los últimos 3
        this.totalPropietarios = resp.contadorPropietarios;
        this.totalVisitas = resp.contadorVisitas;
      }
    },
    error: (err) => console.error('Error de conexión con la bitácora:', err)
  });
}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
