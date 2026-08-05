import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonButton, IonIcon, IonBadge, IonModal } from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode';
import { Share } from '@capacitor/share'; // 🌟 Plugin nativo para compartir [1]
import { addIcons } from 'ionicons';
import { shareSocialOutline, timeOutline, checkmarkCircleOutline, closeCircleOutline, eyeOutline, closeOutline, addOutline } from 'ionicons/icons';
import { AccesscodeService } from '../../../services/accesscode.service';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, QRCodeComponent,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonBadge, IonModal,LoadingComponent
]
})
export class VisitasComponent implements OnInit {
  propietarioId = '';
  listaVisitas: any[] = [];
  isLoading = false;
  
  // Variables para controlar el visor del QR seleccionado
  isModalOpen = false;
  tokenSeleccionado = '';
  nombreVisitaSeleccionada = '';
  visitaSeleccionada : any; // Variable para almacenar la visita seleccionada

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private accesscodeService: AccesscodeService,
  ) {
    addIcons({ shareSocialOutline, timeOutline, checkmarkCircleOutline, closeCircleOutline, eyeOutline, closeOutline, addOutline });
  }

  ngOnInit() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      this.propietarioId = JSON.parse(usuarioJSON).uid;
      this.cargarHistorialVisitas();
    }

    // Escuchar si venimos de 'generar-visita' con un token nuevo para abrirlo de inmediato
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.abrirVisorQR(params['token'], 'Nueva Visita Creada');
      }
    });
  }

  cargarHistorialVisitas() {
    // Endpoint de tu backend para listar visitas de este dueño específico
    this.isLoading = true;
    this.accesscodeService.getVisitasUser(this.propietarioId)
      .subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this.listaVisitas = resp.visitas || [];
            this.isLoading = false;
          }
        },
        error: (err) => console.error('Error al cargar historial de visitas:', err)
      });
  }

  abrirVisorQR(token: string, nombreVisita: string, visita?: any) {
    this.tokenSeleccionado = token;
    this.nombreVisitaSeleccionada = nombreVisita;
    this.visitaSeleccionada = visita; // Guardamos la visita seleccionada
    console.log(visita)
    this.isModalOpen = true;
  }

  eliminarCodigo(visitaSeleccionada: string) {
    if (!this.visitaSeleccionada) return;

    // Llamamos al método DELETE especializado pasándole el ID de la casa y el _id del carro

    this.accesscodeService.deleteCode(this.visitaSeleccionada._id).subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          // Filtramos localmente el carro eliminado para removerlo de la vista sin recargar la página
          // this.propiedad.vehiculosPropietario = this.propiedad.vehiculosPropietario.filter(
          //   (v: any) => v._id !== vehiculoId
          // );
        }
      },
      error: (err) => console.error('Error al remover el vehículo:', err)
    });
  }

  cerrarVisorQR() {
    this.isModalOpen = false;
    this.tokenSeleccionado = '';
  }


async compartirPorWhatsApp() {
  const textoMensaje = `Hola ${this.nombreVisitaSeleccionada}, este es tu pase de acceso rápido QR para la urbanización. Al llegar a la portería muéstralo frente al lector. Código de acceso: ${this.tokenSeleccionado}`;

  // PLAN A: Si es un navegador móvil (Chrome/Safari) dentro de la PWA, usamos la API nativa
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Pase para ${this.nombreVisitaSeleccionada}`,
        text: textoMensaje,
      });
      console.log('Compartido con éxito mediante Web Share API');
    } catch (error) {
      console.error('El usuario canceló o hubo un error al compartir:', error);
    }
  } else {
    // PLAN B: Fallback para computadoras o navegadores que no soportan Web Share
    // Codificamos el texto para que sea seguro viajar en una URL de internet
    const textoCodificado = encodeURIComponent(textoMensaje);
    
    // Abrimos una pestaña nueva con la API directa de WhatsApp (funciona en móvil y PC)
    const urlWhatsApp = `https://whatsapp.com{textoCodificado}`;
    window.open(urlWhatsApp, '_blank');
  }
}



}
