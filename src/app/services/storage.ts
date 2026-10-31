import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';


@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor() {
    }
     // Guardar un valor por clave 
        async guardar(key: string, value:string ){
            await Preferences.set({
                key: key,
                value: value,
            });
        }
        // Leer un valor por clave 
        async obtener(key: string): Promise<string | null> {
            const { value } = await Preferences.get({key: key });
            return value;
        }
        //Eliminar un valor por clave 
        async eliminar(key: string ){
        await Preferences.remove({key: key });
        }

        // Limpiar todo el almacenamiento local 
        async limpiar(){
            await Preferences.clear();
        }
}
