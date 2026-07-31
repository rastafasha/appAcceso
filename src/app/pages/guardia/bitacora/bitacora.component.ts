import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, 
  IonIcon, IonList, IonItem, IonLabel, IonBadge 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, carOutline, peopleOutline, refreshOutline } from 'ionicons/icons';
import { AccesscodeService } from '../../../services/accesscode.service';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge
]
})
export class BitacoraComponent implements OnInit {
  historialCompleto: any[] = [];

  constructor(
    private http: HttpClient,
    private accessCodeService: AccesscodeService,
  ) {
    addIcons({ arrowBackOutline, carOutline, peopleOutline, refreshOutline });
  }

  ngOnInit() {
    this.cargarBitacoraCompleta();
  }

  cargarBitacoraCompleta() {
    this.accessCodeService.getBitacoraHoy().subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          this.historialCompleto = resp.accesos || [];
        }
      },
      error: (err) => console.error('Error cargando la bitácora extendida:', err)
    });
  }
}
