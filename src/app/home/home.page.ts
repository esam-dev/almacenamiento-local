import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  closeOutline,
  documentTextOutline,
  gridOutline,
  homeOutline,
  imageOutline,
  personCircleOutline,
  refreshOutline,
  saveOutline,
} from 'ionicons/icons';

import type { ArchivoLocal, TipoArchivo } from '../services/archivo-local';
import { ArchivoLocalService } from '../services/archivo-local';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  nombre = '';
  tipo: TipoArchivo = 'texto';
  contenido = '';
  archivos: ArchivoLocal[] = [];
  private archivosLocal = inject(ArchivoLocalService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      closeCircleOutline,
      closeOutline,
      documentTextOutline,
      gridOutline,
      homeOutline,
      imageOutline,
      personCircleOutline,
      refreshOutline,
      saveOutline,
    });
  }

  ngOnInit(): void {
    void this.cargarArchivos();
  }

  recargarBiblioteca(): void {
    void this.cargarArchivos();
  }

  async guardar(): Promise<void> {
    if (!this.nombre.trim() || !this.contenido)
      return this.notificar('Completa el nombre y el contenido del archivo.', 'danger');
    await this.archivosLocal.guardar({
      id: crypto.randomUUID(),
      nombre: this.nombre.trim(),
      tipo: this.tipo,
      contenido: this.contenido,
    });
    await this.notificar('Archivo guardado localmente.', 'success');
    this.nombre = '';
    this.contenido = '';
    this.tipo = 'texto';
    await this.cargarArchivos();
  }

  async cargarImagen(evento: Event): Promise<void> {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) return;
    this.tipo = 'imagen';
    this.nombre = this.nombre || archivo.name;
    this.contenido = await this.leerComoDataUrl(archivo);
  }

  irA(ruta: string): void {
    void this.router.navigateByUrl(ruta);
  }

  private async cargarArchivos(): Promise<void> {
    this.archivos = await this.archivosLocal.listar();
  }

  private leerComoDataUrl(archivo: File): Promise<string> {
    return new Promise((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onload = () => resolver(String(lector.result));
      lector.onerror = () => rechazar(lector.error);
      lector.readAsDataURL(archivo);
    });
  }

  private async notificar(mensaje: string, color: 'danger' | 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      color,
      duration: 2500,
      position: 'top',
      icon: color === 'success' ? 'checkmark-circle-outline' : 'close-circle-outline',
      buttons: [{ icon: 'close-outline', role: 'cancel' }],
    });
    await toast.present();
  }
}
