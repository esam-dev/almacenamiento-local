import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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
  IonModal,
  IonNote,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  documentOutline,
  closeOutline,
  documentTextOutline,
  eyeOutline,
  newspaperOutline,
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
    IonModal,
    IonNote,
    IonSearchbar,
    IonTitle,
    IonToolbar,
  ],
})
export class RegistrosPage implements OnInit {
  // Signals: sin zone.js, una propiedad normal asignada tras un await no redibuja la vista.
  filtro = signal('');
  archivos = signal<ArchivoLocal[]>([]);
  /** Archivo que se está viendo en el visor (null = visor cerrado) */
  seleccionado = signal<ArchivoLocal | null>(null);
  archivosFiltrados = computed(() => {
    const filtro = this.filtro().toLocaleLowerCase();
    return this.archivos().filter(
      (archivo) => !filtro || archivo.nombre.toLocaleLowerCase().includes(filtro) || archivo.tipo.includes(filtro),
    );
  });

  private archivosLocal = inject(ArchivoLocalService);
  private router = inject(Router);

  constructor() {
    addIcons({
      closeOutline,
      documentOutline,
      documentTextOutline,
      eyeOutline,
      newspaperOutline,
      gridOutline,
      homeOutline,
      imageOutline,
      personCircleOutline,
    });
  }

  ngOnInit(): void {
    void this.actualizar();
  }

  ionViewWillEnter(): void {
    void this.actualizar();
  }

  async actualizar(): Promise<void> {
    this.archivos.set(await this.archivosLocal.listar());
  }

  ver(archivo: ArchivoLocal): void {
    this.seleccionado.set(archivo);
  }

  cerrarVisor(): void {
    this.seleccionado.set(null);
  }

  /** Resumen para la lista: cantidad de fotos de un documento. */
  resumenDocumento(archivo: ArchivoLocal): string {
    const fotos = archivo.imagenes?.length ?? 0;
    return `${fotos} foto(s)`;
  }

  async eliminar(id: string): Promise<void> {
    await this.archivosLocal.eliminar(id);
    await this.actualizar();
  }

  irA(ruta: string): void {
    void this.router.navigateByUrl(ruta);
  }
}
