import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { homeOutline, peopleOutline, personOutline } from 'ionicons/icons';

import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsComponent  implements OnInit {

  constructor() {
    // Registramos los íconos de Ionicons requeridos para los botones
    addIcons({ homeOutline, peopleOutline, personOutline });
  }

  ngOnInit() {}

}
