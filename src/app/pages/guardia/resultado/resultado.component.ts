import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, 
  IonIcon, IonBadge, IonSpinner 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline, arrowBackOutline } from 'ionicons/icons';
import { AccesscodeService } from '../../../services/accesscode.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, IonContent, IonHeader, 
    IonToolbar, IonTitle, IonButton, IonIcon, IonBadge, IonSpinner
  ]
})
export class ResultadoComponent implements OnInit {
  token = '';
  isLoading = true;
  resultado: any = null;
  errorMensaje = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private accessCodeService: AccesscodeService,
  ) {
    addIcons({ checkmarkCircleOutline, closeCircleOutline, arrowBackOutline });
  }

  ngOnInit() {
    // Capturamos el token que nos manda la página del escáner
    this.token = this.route.snapshot.queryParams['token'] || '';
    
    if (this.token) {
      this.verificarAccesoEnServer();
    } else {
      this.router.navigate(['/guardia/dashboard']);
    }
  }

  verificarAccesoEnServer() {
    this.accessCodeService.verificarPuerta({ token: this.token })
      .subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          this.resultado = resp; // { abrir: true/false, infoAcceso, mensaje }
        },
        error: (err) => {
          this.isLoading = false;
          this.resultado = { abrir: false };
          this.errorMensaje = err.error.mensaje || 'Error de conexión o token corrupto';
        }
      });
  }

  volverAlScanner() {
    this.router.navigate(['/guardia/scanner']);
  }
}
