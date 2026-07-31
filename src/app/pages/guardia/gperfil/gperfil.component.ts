import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonIcon, IonBadge 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, carOutline, trashOutline, addCircleOutline, personOutline, mailOutline, phonePortraitOutline } from 'ionicons/icons';


@Component({
  selector: 'app-perfil',
  templateUrl: './gperfil.component.html',
  styleUrls: ['./gperfil.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, 
    IonTitle, IonCard, IonCardContent, IonIcon, IonBadge
  ]
})
export class GperfilComponent  implements OnInit {
  
  datosUsuario: any = {};
  isLoading = false;

  constructor(
  ) {
    addIcons({ homeOutline, carOutline, trashOutline, addCircleOutline, personOutline, mailOutline, phonePortraitOutline });
  }

  ngOnInit() {
    // 1. Obtener la data real del usuario autenticado
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      this.datosUsuario = JSON.parse(usuarioJSON);
    }

  }


}
