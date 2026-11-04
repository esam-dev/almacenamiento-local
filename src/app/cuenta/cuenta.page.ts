import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  cloudOutline,
  gridOutline,
  hardwareChipOutline,
  homeOutline,
  lockClosedOutline,
  personCircleOutline,
  phonePortraitOutline,
  settingsOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTitle,
    IonToolbar,
  ],
})
export class CuentaPage {
  private router = inject(Router);

  constructor() {
    addIcons({
      cloudOutline,
      gridOutline,
      hardwareChipOutline,
      homeOutline,
      lockClosedOutline,
      personCircleOutline,
      phonePortraitOutline,
      settingsOutline,
      shieldCheckmarkOutline,
    });
  }

  irA(ruta: string): void {
    void this.router.navigateByUrl(ruta);
  }
}
