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
4. **Página** (`src/pages/events.astro`): usa fetcher y componente

Ver [Integración Strapi](strapi-consumption.md) para detalles.

