import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonCard, IonCardContent, IonBadge, IonText, IonList, IonItem, IonLabel, IonSpinner } from '@ionic/angular/standalone';
import { ZXingScannerModule } from '@zxing/ngx-scanner'; // 🌟 Escáner Web para PWA
import { addIcons } from 'ionicons';
import { arrowBackOutline, logOutOutline, cameraOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { AccesscodeService } from '../../../services/accesscode.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, ZXingScannerModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton,
    IonIcon, IonBadge,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner
  ]
})
export class ScannerComponent implements OnInit {

  // Variables de control visual y respuesta del backend
  hasCameras = false;
  hasPermission = false;
  scannerEnabled = true;

  resultadoVerificacion: any = null; // Guardará la respuesta de Node.js
  errorMensaje = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private accessCodeService: AccesscodeService,
  ) {
    addIcons({ arrowBackOutline, logOutOutline, cameraOutline, checkmarkCircleOutline, closeCircleOutline });
  }

  ngOnInit() {
    // Verificar si el rol es guardia (por seguridad extra si rompen el guard)
    if (localStorage.getItem('role') !== 'GUARDIA') {
      this.logout();
    }
  }

  // Se ejecuta automáticamente cuando la librería detecta las cámaras del dispositivo
  onCamerasFound(cameras: MediaDeviceInfo[]) {
    this.hasCameras = cameras && cameras.length > 0;
  }

  // Se ejecuta si el guardia acepta el permiso de uso de la cámara en el navegador
  onHasPermission(permission: boolean) {
    this.hasPermission = permission;
  }

  // 🌟 EL MOMENTO CLAVE: Cuando la cámara decodifica un código QR con éxito
  onCodeResult(resultString: string) {
    // Apagamos el escáner temporalmente para no procesar el mismo QR mil veces por segundo
    this.scannerEnabled = false;
    this.isLoading = true;
    this.resultadoVerificacion = null;
    this.errorMensaje = '';

    console.log('Token escaneado en la garita:', resultString);

    // Creamos el payload para enviar a tu controlador de Node.js
    const payload = { token: resultString };

    // Consumimos tu endpoint real de validación de accesos
    this.accessCodeService.verificarPuerta(payload).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        // resp.abrir contendrá true o false según lo que defina MongoDB Atlas
        this.resultadoVerificacion = resp;
        // 🚀 NAVEGAMOS A LA PÁGINA INDEPENDIENTE DE RESULTADO PASANDO EL TOKEN
        this.router.navigate(['/guardia/resultado'], { queryParams: { token: resultString } });
      },
      error: (err) => {
        this.isLoading = false;
        this.resultadoVerificacion = { abrir: false };
        this.errorMensaje = err.error.mensaje || 'Error de red o código inválido';
        console.error('Error al verificar QR en el servidor:', err);
      }
    });

  }

  // Permite al guardia resetear la pantalla para recibir un nuevo vehículo/visitante
  reiniciarEscaner() {
    this.resultadoVerificacion = null;
    this.errorMensaje = '';
    this.scannerEnabled = true;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
