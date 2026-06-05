# Documentacion del proyecto mean_ai

Esta carpeta contiene el itinerario tecnico y docente del proyecto. El orden recomendado de lectura es:

1. [Estructura de archivos para IA y Codex](01-estructura-ia-codex.md)
2. [Monorepo y estructura de carpetas](02-monorepo-estructura.md)
3. [CRUD backend paso a paso](03-crud-backend.md)
4. [CRUD frontend paso a paso](04-crud-frontend.md)
5. [Generacion de descripciones con OpenAI](05-ia-descripciones-streaming.md)

La version unificada para lectura, impresion o entrega esta disponible en:

- [Documentacion completa en formato Word](mean-ai-documentacion.docx)

Como referencia integral tambien se mantiene:

- [Guia completa de productos y categorias](products-crud-guide.md)

## Audiencia

Las guias estan pensadas para alumnado de desarrollo web que trabaja con un caso practico de inventario veterinario. Cada documento combina:

- Conceptos tecnicos.
- Relacion entre capas.
- Pasos de implementacion.
- Comandos de comprobacion.
- Errores frecuentes.
- Preguntas para revisar el aprendizaje.

## Tecnologias

```text
MongoDB        Persistencia documental
Mongoose       Modelado y acceso a MongoDB
Express        API HTTP
Angular        Aplicacion cliente
Signals        Estado reactivo en Angular
Fetch          Comunicacion HTTP y streaming
Bootstrap      Interfaz y diseno responsive
OpenAI         Generacion de descripciones
TypeScript     Tipado en servidor y cliente
npm workspaces Monorepo
```

## Convenciones actuales

- El servidor escucha normalmente en `http://localhost:3000`.
- Angular escucha normalmente en `http://localhost:4200`, aunque desarrollo admite otros puertos locales.
- La configuracion privada vive en `.env` en la raiz.
- `.env` no se versiona.
- `.env.example` documenta variables sin incluir secretos.
- Las llamadas a OpenAI se realizan exclusivamente desde Express.
- Los componentes Angular usan Signals.
- Los servicios Angular usan Fetch y promesas tipadas.
- La interfaz utiliza Bootstrap.

## Comandos de comprobacion

```bash
npm run build
npm run lint
npm test
```

Para comprobaciones mas rapidas:

```bash
npm run typecheck:backend
npm run test:backend
npm run build:frontend
npm run test:frontend
```
