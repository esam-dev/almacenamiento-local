import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  documentOutline,
  documentTextOutline,
  gridOutline,
  homeOutline,
  imageOutline,
  personCircleOutline,
} from 'ionicons/icons';

import type { ArchivoLocal } from '../services/archivo-local';
import { ArchivoLocalService } from '../services/archivo-local';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.page.html',
  styleUrls: ['./registros.page.scss'],
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    IonButton,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonTitle,
    IonToolbar,
  ],
})
export class RegistrosPage implements OnInit {
  filtro = '';
  archivos: ArchivoLocal[] = [];
  private archivosLocal = inject(ArchivoLocalService);
  private router = inject(Router);
  constructor() {
    addIcons({ documentOutline, documentTextOutline, gridOutline, homeOutline, imageOutline, personCircleOutline });
  }
  ngOnInit(): void {
    void this.actualizar();
  }

  ionViewWillEnter(): void {
    void this.actualizar();
  }
  get archivosFiltrados(): ArchivoLocal[] {
    const filtro = this.filtro.toLocaleLowerCase();
    return this.archivos.filter(
      (archivo) => !filtro || archivo.nombre.toLocaleLowerCase().includes(filtro) || archivo.tipo.includes(filtro),
    );
  }
  async actualizar(): Promise<void> {
    this.archivos = await this.archivosLocal.listar();
  }
  async eliminar(id: string): Promise<void> {
    await this.archivosLocal.eliminar(id);
    await this.actualizar();
  }
  irA(ruta: string): void {
    void this.router.navigateByUrl(ruta);
  }
}
