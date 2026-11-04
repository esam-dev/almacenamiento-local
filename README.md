# Almacenamiento Local

Aplicación Ionic y Angular para crear, organizar y consultar archivos locales desde el navegador. La interfaz se inspira en patrones de bibliotecas de archivos: navegación inferior, tarjetas de resumen, lista de archivos y ajustes del dispositivo.

## Funcionalidades

- Creación de documentos de texto y Markdown.
- Importación de imágenes con vista previa antes de guardar.
- Biblioteca de archivos con búsqueda, iconos por tipo y miniaturas de imágenes.
- Eliminación de archivos locales.
- Persistencia local mediante IndexedDB a través de `localforage`.
- Pantallas independientes para Inicio, Archivos y Cuenta.
- Navegación con rutas `/home`, `/archivos` y `/cuenta`.

## Arquitectura

| Área | Responsabilidad |
| --- | --- |
| `src/app/home` | Creación e importación de archivos |
| `src/app/registros` | Biblioteca, búsqueda y eliminación de archivos |
| `src/app/cuenta` | Información de almacenamiento local y privacidad |
| `src/app/services/archivo-local.ts` | Persistencia de archivos en IndexedDB |

Cada archivo local contiene un identificador, nombre, tipo (`texto`, `markdown` o `imagen`), contenido y fecha de actualización. Las imágenes se almacenan como datos locales y se muestran como miniaturas dentro de la biblioteca.

## Requisitos

- Node.js 20 o superior
- npm

## Ejecución

```bash
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200` o en el puerto configurado por Angular.

## Validación

```bash
npm run eslint
npm run test:unit
```

## Persistencia

Los archivos se guardan en el almacenamiento local del navegador. No se envían a servicios externos ni se sincronizan entre dispositivos. Limpiar los datos del navegador elimina la biblioteca almacenada.
