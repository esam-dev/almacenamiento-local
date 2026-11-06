import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface RegistroAlmacenado {
  clave: string;
  valor: string | null;
}

export interface Compra {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  completado: boolean;
}

const PREFIJO_COMPRA = 'compra:';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  async guardar(clave: string, valor: string): Promise<void> {
    await Preferences.set({ key: clave, value: valor });
  }

  async obtener(clave: string): Promise<string | null> {
    const { value } = await Preferences.get({ key: clave });
    return value;
  }

  async listar(): Promise<RegistroAlmacenado[]> {
    const { keys } = await Preferences.keys();
    return Promise.all(
      keys.map(async (clave) => ({
        clave,
        valor: await this.obtener(clave),
      })),
    );
  }

  async eliminar(clave: string): Promise<void> {
    await Preferences.remove({ key: clave });
  }

  async limpiar(): Promise<void> {
    await Preferences.clear();
  }

  async agregarCompra(nombre: string, categoria: string, cantidad: number): Promise<Compra> {
    const compra: Compra = {
      id: `${Date.now()}`,
      nombre,
      categoria,
      cantidad,
      completado: false,
    };
    await this.guardar(`${PREFIJO_COMPRA}${compra.id}`, JSON.stringify(compra));
    return compra;
  }

  async listarCompras(): Promise<Compra[]> {
    const registros = await this.listar();
    const compras: Compra[] = [];

    for (const registro of registros) {
      if (!registro.clave.startsWith(PREFIJO_COMPRA) || !registro.valor) continue;

      try {
        const compra = JSON.parse(registro.valor) as Compra;
        if (this.esCompraValida(compra)) compras.push(compra);
      } catch (error) {
        console.warn(`No se pudo leer la compra almacenada en "${registro.clave}".`, error);
      }
    }

    return compras.sort((primera, segunda) => Number(segunda.id) - Number(primera.id));
  }

  async actualizarCompra(compra: Compra): Promise<void> {
    await this.guardar(`${PREFIJO_COMPRA}${compra.id}`, JSON.stringify(compra));
  }

  private esCompraValida(compra: Compra): boolean {
    return (
      typeof compra.id === 'string' &&
      typeof compra.nombre === 'string' &&
      typeof compra.categoria === 'string' &&
      typeof compra.cantidad === 'number' &&
      typeof compra.completado === 'boolean'
    );
  }
}
