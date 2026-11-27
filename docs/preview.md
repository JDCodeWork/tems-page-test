# Vista previa desde Strapi

En el admin de Strapi, al editar un proyecto, evento, persona del equipo, Nosotros, Únete o los ajustes del sitio, aparece el botón **Vista previa** (*Open preview*). Abre la página del sitio tal como quedaría con lo que se acaba de guardar, **sin publicar** y sin esperar un build.

## Cómo funciona

```
Admin de Strapi ──► https://<sitio>/preview?uid=…&documentId=…&status=draft&secret=…
                         │
                         ▼
          Función de Netlify (solo esta ruta; el resto del sitio sigue estático)
                         │  src/middleware.ts comprueba PREVIEW_SECRET
                         ▼
          Pide a Strapi la versión borrador (status=draft) y pinta la misma
          vista que usa el sitio (src/views/*)
```

- `src/pages/preview.astro` decide qué página mostrar según la colección: un proyecto abre su página; un evento o una categoría, `/eventos`; Únete, `/unete`; Nosotros, el equipo y los ajustes, la portada.
- `src/lib/preview.ts` guarda el estado de la vista previa durante la petición. `src/lib/strapi.ts` lo lee para pedir borradores y no cachear.
- En la pestaña *Published* del admin, la vista previa muestra la versión publicada.
- La página lleva un aviso "Vista previa", `noindex`, `Cache-Control: no-store` y solo se puede mostrar dentro del admin de Strapi (`frame-ancestors`).

## Configuración

Genera un secreto (ej. `openssl rand -base64 32`) y ponlo **igual** en los dos lados.

**Netlify** (tems-page) → *Site configuration → Environment variables*:

| Variable | Valor |
|---|---|
| `PREVIEW_SECRET` | el secreto |

`STRAPI_URL` y `STRAPI_TOKEN` ya existen. Deben estar disponibles también para *Functions* (es el valor por defecto en Netlify). El token *Read-only* sirve: también puede leer borradores.

**Render** (tems-page-cms) → *Environment*:

| Variable | Valor |
|---|---|
| `CLIENT_URL` | URL pública del sitio, sin `/` final (ej. `https://temsunal.org`) |
| `PREVIEW_SECRET` | el mismo secreto |

Si falta `CLIENT_URL` o `PREVIEW_SECRET` en Strapi, el botón de vista previa no aparece.

## En local

- tems-page: `PREVIEW_SECRET` en `.env`, y `pnpm dev`.
- tems-page-cms: `CLIENT_URL=http://localhost:4321` y el mismo `PREVIEW_SECRET` en su `.env`.

## Problemas comunes

| Síntoma | Causa |
|---|---|
| "Vista previa no autorizada" (401) | `PREVIEW_SECRET` distinto en Strapi y Netlify, o falta en Netlify. |
| El panel de vista previa sale en blanco | `CLIENT_URL` no coincide con el dominio del sitio, o `STRAPI_URL` en Netlify no es el dominio del admin (lo usa `frame-ancestors`). |
| "Este proyecto aún no se puede previsualizar" | El proyecto no se ha guardado todavía. |
