# Integración con Strapi

Strapi ([tems-page-cms](https://github.com/TEMSUNAL/tems-page-cms)) es el CMS donde se edita el contenido sin tocar el código. El sitio es **estático**: el contenido se descarga de Strapi **durante el build** y queda embebido en el HTML. Por eso cada cambio en el CMS dispara un nuevo build en Netlify (ver [Despliegue en Netlify](deploy-netlify.md)).

## Contenido dinámico

| Dónde se ve | Content type en Strapi | Fetcher |
|---|---|---|
| Nosotros (portada) | `about` (single type) | `src/lib/site.ts` → `fetchAbout` |
| Nuestros proyectos, `/proyectos`, `/proyectos/<slug>` | `projects` | `src/lib/projects.ts` |
| Próximos eventos, `/eventos` | `events` | `src/lib/events.ts` |
| Nuestro equipo y miembros de cada proyecto | `team-members` | `src/lib/team.ts` |
| `/unete` | `join-page` (single type) | `src/lib/site.ts` → `fetchJoinPage` |
| Descripción SEO, footer (correo y redes) | `site-setting` (single type) | `src/lib/site.ts` → `fetchSiteSettings` |

Las cifras de "Nosotros" (proyectos activos, personas en el equipo, próximos eventos) se calculan solas a partir del contenido publicado.

## Variables de entorno

```env
STRAPI_URL=http://localhost:1337   # sin /api al final
STRAPI_TOKEN=                      # API token read-only
SITE_URL=                          # dominio público (canonical, sitemap). En Netlify se usa `URL` si no se define
```

Copia `.env.example` a `.env`. Las variables **no** llevan prefijo `PUBLIC_` porque solo se usan en build: el token nunca llega al navegador.

### Comportamiento según el entorno

| Situación | Resultado |
|---|---|
| `STRAPI_URL` sin definir | Se usa el contenido de ejemplo de `src/lib/content.ts`. Ideal para maquetar sin CMS. |
| `STRAPI_URL` definido y Strapi responde | Se usa el contenido del CMS. |
| `STRAPI_URL` definido y Strapi falla (3 intentos) | **El build falla.** Netlify mantiene publicado el último deploy correcto en lugar de mostrar datos de ejemplo. |
| Un single type (About, Join Page, Site Settings) aún no se ha publicado | Strapi responde 404 y se usan textos por defecto genéricos (no los de ejemplo). |

### Imágenes

Las imágenes (fotos, portadas, imágenes dentro de la descripción) se **descargan y optimizan durante el build** con `astro:assets` y se sirven desde Netlify. El sitio publicado no depende de que Strapi o Cloudinary estén disponibles. Los hosts permitidos se configuran en `astro.config.mjs` (`res.cloudinary.com` + el host de `STRAPI_URL`).

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
| `role` | Text (short) | requerido. Rol general en TEMS |
| `photo` | Media (single, imagen) | opcional. Recomendado: fondo transparente, 4:5 |
| `linkedin` | Text (short) | URL completa |
| `email` | Email | se convierte en `mailto:` |
| `order` | Integer | orden de aparición (ascendente) |
| `showInTeam` | Boolean | `false` para personas que solo aparecen en proyectos (no en "Nuestro equipo") |

### `Project` (collection type → API `projects`)

| Campo | Tipo | Notas |
|---|---|---|
| `name` | Text (short) | requerido, único. **La URL se calcula a partir del nombre** (`Robótica Ágil` → `/proyectos/robotica-agil`); no hay campo slug |
| `summary` | Text (long, máx. 220) | requerido. Texto de la tarjeta y descripción para buscadores |
| `description` | Rich text (Blocks) | descripción completa en la página del proyecto |
| `cover` | Media (single, imagen) | portada; también se usa al compartir en redes |
| `color` | Enumeration | `orange`, `blue`, `violet`, `green` |
| `status` | Enumeration | `activo`, `en-pausa`, `finalizado` |
| `features` | Component (repeatable) `shared.feature` | características: `text` + `icon` ([Lucide](https://lucide.dev/icons), ej. `graduation-cap`). El primer icono es el de la tarjeta |
| `members` | Component (repeatable) `project.member` | `person` (relación a Team Member) + `role` (rol dentro del proyecto) |
| `links` | Component (repeatable) `shared.link` | `label` + `url` (repositorio, demo, inscripciones…) |
| `featured` | Boolean | si aparece en la portada (si ninguno está marcado, se muestran los 3 primeros) |
| `order` | Integer | orden de aparición |

> Si dos proyectos generan la misma URL, al segundo se le añade `-2`. Cambiar el nombre cambia la URL.

### `About` (single type → API `about`)

`title`, `intro` (requerido), `mission`, `vision`. Misión y visión son opcionales: si están vacías, no se muestran.

### `Join Page` (single type → API `join-page`)

| Campo | Tipo | Notas |
|---|---|---|
| `intro` | Text (long) | requerido |
| `recruitmentOpen` | Boolean | muestra "Convocatoria abierta/cerrada" |
| `recruitmentNote` | Text (short) | reemplaza ese texto (ej. "Inscripciones hasta el 15 de marzo") |
| `whatsappUrl` | Text (short) | enlace de invitación al grupo |
| `steps` | Component (repeatable) `join.step` | `title` + `description` |
| `contacts` | Component (repeatable) `join.contact` | `name`, `role`, `email`, `phone`. Si el teléfono empieza con indicativo (`+57 …`) se enlaza a WhatsApp |
| `details` | Rich text (Blocks) | información adicional opcional |

### `Site Settings` (single type → API `site-setting`)

`description` (texto para buscadores y redes), `contactEmail`, `socialLinks` (component repeatable `shared.social-link`: `network` = `instagram` | `linkedin` | `youtube` | `whatsapp` | `email`, y `url`).

### Permisos

1. **Settings → API Tokens → Create new API Token**: tipo *Read-only*, duración *Unlimited*. Ese valor es `STRAPI_TOKEN`.
2. No es necesario abrir permisos al rol *Public*: el sitio siempre consulta con el token.

## Arquitectura: Fetch → Transform → Display

```
Strapi API (REST v5)
    ↓
src/lib/strapi.ts        → cliente: URL, token, reintentos, URLs de media
    ↓
src/lib/{events,team,projects,site}.ts → consulta + mapeo al tipo del sitio
    ↓
src/types/index.ts       → TemsEvent, TeamMember, Project, …
    ↓
components/*/…astro      → `const data = await fetchX()` en el frontmatter
```

## Añadir una nueva colección

1. Crear el content type en Strapi y darle acceso de lectura al API token.
2. Definir el tipo en `src/types/index.ts`.
3. Crear el fetcher en `src/lib/<coleccion>.ts` usando `fetchCollection`:

```ts
import { fetchCollection, toMedia, type StrapiMedia } from "./strapi";

type StrapiProject = { id: number; name: string; cover?: StrapiMedia };

export async function fetchProjects() {
	const data = await fetchCollection<StrapiProject>("projects", {
		sort: "createdAt:desc",
		populate: "cover",
	});
	if (data === null) return []; // o contenido de ejemplo

	return data.map((p) => ({ id: p.id, name: p.name, cover: toMedia(p.cover, p.name) }));
}
```

4. Llamarlo desde el componente: `const projects = await fetchProjects()`.

Para un single type se usa `fetchSingle` (devuelve `{}` si aún no se ha publicado). Las peticiones se cachean durante el build, así que varias páginas pueden pedir lo mismo sin costo.

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
