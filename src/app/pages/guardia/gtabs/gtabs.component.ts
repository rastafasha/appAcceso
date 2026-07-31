import { Component, OnInit } from '@angular/core';
import { IonTabs,  IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/angular/standalone";
import { shieldHalfOutline, scanCircleOutline, documentTextOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
@Component({
  selector: 'app-gtabs',
  templateUrl: './gtabs.component.html',
  styleUrls: ['./gtabs.component.scss'],
  imports: [IonTabs,  IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class GtabsComponent  implements OnInit {

  constructor() {
  addIcons({ shieldHalfOutline, scanCircleOutline, documentTextOutline });
}
  ngOnInit() {}

}
