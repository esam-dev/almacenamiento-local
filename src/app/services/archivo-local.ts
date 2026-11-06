import { Injectable } from '@angular/core';
import localforage from 'localforage';

export type TipoArchivo = 'imagen' | 'markdown' | 'texto' | 'documento';

export interface ArchivoLocal {
  id: string;
  nombre: string;
  tipo: TipoArchivo;
  /** Texto, Markdown, data URL de la imagen, o el texto del documento */
  contenido: string;
  /** Solo documento: fotos (data URL) que acompañan al texto del contenido */
  imagenes?: string[];
  actualizadoEn: number;
}

/** Formato antiguo de un registro guardado por versiones previas (PDF o documento por bloques). */
interface RegistroAntiguo extends Omit<ArchivoLocal, 'tipo'> {
  tipo: string;
  texto?: string;
  bloques?: { tipo: 'texto' | 'imagen'; valor: string }[];
}

@Injectable({ providedIn: 'root' })
export class ArchivoLocalService {
  private archivos = localforage.createInstance({
    name: 'almacenamiento-local',
    storeName: 'archivos',
  });

  async listar(): Promise<ArchivoLocal[]> {
    const archivos: ArchivoLocal[] = [];
    await this.archivos.iterate<RegistroAntiguo, void>((registro) => {
      archivos.push(this.normalizar(registro));
    });
    return archivos.sort((primero, segundo) => segundo.actualizadoEn - primero.actualizadoEn);
  }

  async guardar(archivo: Omit<ArchivoLocal, 'actualizadoEn'>): Promise<void> {
    await this.archivos.setItem(archivo.id, { ...archivo, actualizadoEn: Date.now() });
  }

  async eliminar(id: string): Promise<void> {
    await this.archivos.removeItem(id);
  }

  /** Convierte registros de versiones anteriores (PDF / bloques) al formato actual de documento. */
  private normalizar(registro: RegistroAntiguo): ArchivoLocal {
    if (registro.tipo === 'pdf') {
      return {
        id: registro.id,
        nombre: registro.nombre.replace(/\.pdf$/i, ''),
        tipo: 'documento',
        contenido: registro.texto ?? '',
        imagenes: registro.imagenes ?? [],
        actualizadoEn: registro.actualizadoEn,
      };
    }
    if (registro.tipo === 'documento' && registro.bloques) {
      return {
        id: registro.id,
        nombre: registro.nombre,
        tipo: 'documento',
        contenido: registro.bloques
          .filter((bloque) => bloque.tipo === 'texto')
          .map((bloque) => bloque.valor)
          .join('\n\n'),
        imagenes: registro.bloques.filter((bloque) => bloque.tipo === 'imagen').map((bloque) => bloque.valor),
        actualizadoEn: registro.actualizadoEn,
      };
    }
    return registro as ArchivoLocal;
  }
}
