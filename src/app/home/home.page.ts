import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
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
  cameraOutline,
  closeCircle,
  closeCircleOutline,
  closeOutline,
  documentTextOutline,
  gridOutline,
  homeOutline,
  imageOutline,
  personCircleOutline,
  refreshOutline,
  saveOutline,
  trashOutline,
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
  // Signals: la app no usa zone.js, así que el estado debe ser reactivo
  // para que la vista se actualice después de una operación asíncrona.
  nombre = signal('');
  tipo = signal<TipoArchivo>('texto');
  contenido = signal('');
  archivos = signal<ArchivoLocal[]>([]);
  /** Fotos del documento (data URL); forman parte del campo de contenido */
  fotos = signal<string[]>([]);

  private entradaArchivo = viewChild<ElementRef<HTMLInputElement>>('entradaArchivo');
  private archivosLocal = inject(ArchivoLocalService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  constructor() {
    addIcons({
      cameraOutline,
      checkmarkCircleOutline,
      closeCircle,
      closeCircleOutline,
      closeOutline,
      documentTextOutline,
      gridOutline,
      homeOutline,
      imageOutline,
      personCircleOutline,
      refreshOutline,
      saveOutline,
      trashOutline,
    });
  }

  ngOnInit(): void {
    void this.cargarArchivos();
  }

  // La página queda en caché dentro del stack de Ionic; se recarga cada vez que se vuelve a ella.
  ionViewWillEnter(): void {
    void this.cargarArchivos();
  }

  recargarBiblioteca(): void {
    void this.cargarArchivos();
  }

  cambiarTipo(nuevoTipo: TipoArchivo): void {
    // Evita que un texto escrito se use como "imagen" (y viceversa) al cambiar de tipo
    if ((nuevoTipo === 'imagen') !== (this.tipo() === 'imagen')) {
      this.contenido.set('');
    }
    if (nuevoTipo !== 'documento') {
      this.fotos.set([]);
    }
    this.tipo.set(nuevoTipo);
  }

  async guardar(): Promise<void> {
    const esDocumento = this.tipo() === 'documento';
    const sinContenido = esDocumento ? !this.contenido().trim() && !this.fotos().length : !this.contenido();
    if (!this.nombre().trim() || sinContenido)
      return this.notificar(
        esDocumento ? 'Completa el nombre y agrega texto o fotos al contenido.' : 'Completa el nombre y el contenido del archivo.',
        'danger',
      );

    await this.archivosLocal.guardar({
      id: crypto.randomUUID(),
      nombre: this.nombre().trim(),
      tipo: this.tipo(),
      contenido: this.contenido(),
      ...(esDocumento ? { imagenes: this.fotos() } : {}),
    });
    await this.notificar(esDocumento ? 'Documento guardado localmente.' : 'Archivo guardado localmente.', 'success');
    this.nombre.set('');
    this.contenido.set('');
    this.fotos.set([]);
    this.tipo.set('texto');
    await this.cargarArchivos();
  }

  quitarFoto(indice: number): void {
    this.fotos.update((lista) => lista.filter((_, posicion) => posicion !== indice));
  }

  /** Abre la cámara del dispositivo y usa la foto tomada como contenido del archivo. */
  async tomarFoto(): Promise<void> {
    try {
      const foto = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
        quality: 80,
        width: 1280,
        correctOrientation: true,
      });
      if (!foto.dataUrl) return;
      if (this.tipo() === 'documento') {
        this.fotos.update((lista) => [...lista, foto.dataUrl!]);
        return;
      }
      this.tipo.set('imagen');
      this.nombre.update((actual) => actual || `foto-${this.marcaDeTiempo()}.${foto.format || 'jpeg'}`);
      this.contenido.set(foto.dataUrl);
    } catch (error) {
      if (this.fueCancelado(error)) return;
      await this.notificar('No se pudo abrir la cámara. Revisa los permisos de la aplicación.', 'danger');
    }
  }

  /** Abre el selector de archivos para subir una imagen existente. */
  subirFoto(): void {
    this.entradaArchivo()?.nativeElement.click();
  }

  async cargarImagen(evento: Event): Promise<void> {
    const entrada = evento.target as HTMLInputElement;
    const archivos = Array.from(entrada.files ?? []);
    if (!archivos.length) return;

    if (this.tipo() === 'documento') {
      // En un documento se pueden subir varias fotos a la vez
      const nuevas = await Promise.all(archivos.map((archivo) => this.leerComoDataUrl(archivo)));
      this.fotos.update((lista) => [...lista, ...nuevas]);
    } else {
      this.tipo.set('imagen');
      this.nombre.update((actual) => actual || archivos[0].name);
      this.contenido.set(await this.leerComoDataUrl(archivos[0]));
    }
    entrada.value = ''; // permite volver a elegir la misma imagen
  }

  quitarImagen(): void {
    this.contenido.set('');
  }

  irA(ruta: string): void {
    void this.router.navigateByUrl(ruta);
  }

  private async cargarArchivos(): Promise<void> {
    this.archivos.set(await this.archivosLocal.listar());
  }

  private marcaDeTiempo(): string {
    return new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  }

  private fueCancelado(error: unknown): boolean {
    const mensaje = String((error as { message?: string })?.message ?? error).toLowerCase();
    return mensaje.includes('cancel');
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
