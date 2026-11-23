# Integración con Strapi

Strapi ([tems-page-cms](https://github.com/TEMSUNAL/tems-page-cms)) es el CMS donde se edita el contenido sin tocar el código. El sitio es **estático**: el contenido se descarga de Strapi **durante el build** y queda embebido en el HTML. Por eso cada cambio en el CMS dispara un nuevo build en Netlify (ver [Despliegue en Netlify](deploy-netlify.md)).

## Contenido dinámico

| Sección de la landing | Colección en Strapi | Fetcher |
|---|---|---|
| Nuestras divisiones | `divisions` | `src/lib/divisions.ts` |
| Próximos eventos | `events` | `src/lib/events.ts` |
| Nuestro equipo | `team-members` | `src/lib/team.ts` |

## Variables de entorno

```env
STRAPI_URL=http://localhost:1337   # sin /api al final
STRAPI_TOKEN=                      # API token read-only
```

Copia `.env.example` a `.env`. Las variables **no** llevan prefijo `PUBLIC_` porque solo se usan en build: el token nunca llega al navegador.

### Comportamiento según el entorno

| Situación | Resultado |
|---|---|
| `STRAPI_URL` sin definir | Se usa el contenido de ejemplo de `src/lib/content.ts`. Ideal para maquetar sin CMS. |
| `STRAPI_URL` definido y Strapi responde | Se usa el contenido del CMS. |
| `STRAPI_URL` definido y Strapi falla (3 intentos) | **El build falla.** Netlify mantiene publicado el último deploy correcto en lugar de mostrar datos de ejemplo. |

## Content types en Strapi

Crear en **Content-Type Builder** (Strapi v5). Activar *Draft & Publish* para que solo lo publicado aparezca en el sitio.

### `Event` (collection type → API `events`)

| Campo | Tipo | Notas |
|---|---|---|
| `title` | Text (short) | requerido |
| `description` | Text (long) | requerido |
| `date` | Datetime | requerido. Solo se muestran eventos con fecha ≥ hoy |
| `category` | Enumeration | `charla`, `taller`, `conexa` |
| `location` | Text (short) | requerido |
| `speakerName` | Text (short) | opcional |
| `speakerPhoto` | Media (single, imagen) | opcional |
| `url` | Text (short) | opcional, enlace al detalle o inscripción |

### `Team Member` (collection type → API `team-members`)

| Campo | Tipo | Notas |
|---|---|---|
| `name` | Text (short) | requerido |
| `role` | Text (short) | requerido |
| `photo` | Media (single, imagen) | opcional. Recomendado: fondo transparente, 4:5 |
| `linkedin` | Text (short) | URL completa |
| `email` | Email | se convierte en `mailto:` |
| `order` | Integer | orden de aparición (ascendente) |

### `Division` (collection type → API `divisions`)

| Campo | Tipo | Notas |
|---|---|---|
| `title` | Text (short) | requerido |
| `subtitle` | Text (short) | requerido |
| `color` | Enumeration | `orange`, `blue`, `violet`, `green` |
| `ctaText` | Text (short) | texto del botón |
| `ctaUrl` | Text (short) | enlace del botón |
| `order` | Integer | orden de aparición |
| `items` | Component (repeatable) `shared.division-item` | `text` (Text) + `icon` (Text, nombre de icono de [Lucide](https://lucide.dev/icons), ej. `graduation-cap`) |

> El primer `icon` de `items` también se usa como icono principal de la tarjeta.

### Permisos

1. **Settings → API Tokens → Create new API Token**: tipo *Read-only*, duración *Unlimited*. Ese valor es `STRAPI_TOKEN`.
2. No es necesario abrir permisos al rol *Public*: el sitio siempre consulta con el token.

## Arquitectura: Fetch → Transform → Display

```
Strapi API (REST v5)
    ↓
src/lib/strapi.ts        → cliente: URL, token, reintentos, URLs de media
    ↓
src/lib/{events,team,divisions}.ts → consulta + mapeo al tipo del sitio
    ↓
src/types/index.ts       → TemsEvent, TeamMember, Division
    ↓
components/*/…astro      → `const data = await fetchX()` en el frontmatter
```

## Añadir una nueva colección

1. Crear el content type en Strapi y darle acceso de lectura al API token.
2. Definir el tipo en `src/types/index.ts`.
3. Crear el fetcher en `src/lib/<coleccion>.ts` usando `fetchCollection`:

```ts
import { fetchCollection, mediaUrl, type StrapiMedia } from "./strapi";

type StrapiProject = { id: number; name: string; cover?: StrapiMedia };

export async function fetchProjects() {
	const data = await fetchCollection<StrapiProject>("projects", {
		sort: "createdAt:desc",
		populate: "cover",
	});
	if (data === null) return []; // o contenido de ejemplo

	return data.map((p) => ({ id: p.id, name: p.name, cover: mediaUrl(p.cover) }));
}
```

4. Llamarlo desde el componente: `const projects = await fetchProjects()`.

### Parámetros útiles de Strapi

```ts
{ "filters[date][$gte]": new Date().toISOString() } // filtrar
{ sort: "date:asc" }                                // ordenar
{ populate: "photo" }                               // incluir media/relaciones
{ "pagination[pageSize]": "20" }                    // paginar
```

## Referencias

- [Despliegue en Netlify](deploy-netlify.md)
- [Estructura del Proyecto](project-structure.md)
- [Documentación de la API REST de Strapi](https://docs.strapi.io/cms/api/rest)
