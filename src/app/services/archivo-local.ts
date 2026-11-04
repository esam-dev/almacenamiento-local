import { Injectable } from '@angular/core';
import localforage from 'localforage';

export type TipoArchivo = 'imagen' | 'markdown' | 'texto';

export interface ArchivoLocal {
  id: string;
  nombre: string;
  tipo: TipoArchivo;
  contenido: string;
  actualizadoEn: number;
}

@Injectable({ providedIn: 'root' })
export class ArchivoLocalService {
  private archivos = localforage.createInstance({
    name: 'almacenamiento-local',
    storeName: 'archivos',
  });

  async listar(): Promise<ArchivoLocal[]> {
    const archivos: ArchivoLocal[] = [];
    await this.archivos.iterate<ArchivoLocal, void>((archivo) => {
      archivos.push(archivo);
    });
    return archivos.sort((primero, segundo) => segundo.actualizadoEn - primero.actualizadoEn);
  }

  async guardar(archivo: Omit<ArchivoLocal, 'actualizadoEn'>): Promise<void> {
    await this.archivos.setItem(archivo.id, { ...archivo, actualizadoEn: Date.now() });
  }

  async eliminar(id: string): Promise<void> {
    await this.archivos.removeItem(id);
  }
}
