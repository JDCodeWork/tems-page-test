# Estructura del Proyecto

## Carpetas principales

```
src/
├── components/      # Componentes Astro reutilizables
├── layouts/         # Plantillas (BaseLayout, etc)
├── pages/           # Rutas del sitio (mapeo automático)
├── lib/             # Helpers, fetchers, utilidades
├── styles/          # CSS global
├── types/           # Tipos TypeScript compartidos
└── assets/          # Imágenes que Astro optimiza

public/              # Archivos estáticos (no se procesan)
```

## Páginas

| Ruta | Archivo |
|---|---|
| `/` | `src/pages/index.astro` (Hero, Nosotros, Proyectos, Eventos, Equipo) |
| `/proyectos` | `src/pages/proyectos/index.astro` |
| `/proyectos/<slug>` | `src/pages/proyectos/[slug].astro` (una página por proyecto de Strapi) |
| `/eventos` | `src/pages/eventos.astro` |
| `/unete` | `src/pages/unete.astro` |
| 404, `robots.txt` | `src/pages/404.astro`, `src/pages/robots.txt.ts` |

El header (`components/layout/SiteHeader.astro`) y el footer (`SiteFooter.astro`) son compartidos. Los enlaces del menú están en `src/lib/navigation.ts`.

## Convenciones

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | PascalCase | `EventCard.astro` |
| Funciones | camelCase | `fetchEvents()` |
| Tipos | PascalCase | `type Event = {...}` |
| Archivos TS | camelCase | `strapi.ts` |
| Constantes | UPPER_SNAKE | `API_URL` |

## Reglas simples

- **Componentes**: pequeños, reutilizables, props tipadas
- **Lib**: contiene lógica (fetch, transformaciones), separada de presentación
- **Pages**: una página por archivo Astro
- **Types**: centralizados, importados en lib y componentes

## Ejemplo: añadir un evento

1. **Fetcher** (`src/lib/events.ts`): obtiene datos de Strapi
2. **Tipo** (`src/types/index.ts`): define estructura `Event`
3. **Componente** (`src/components/EventCard.astro`): consume props
4. **Página** (`src/pages/eventos.astro`): usa fetcher y componente

Ver [Integración Strapi](strapi-consumption.md) para detalles.

