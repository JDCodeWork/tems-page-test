# Guía de Contribución

## Configuración Local

### Requisitos
- Git
- PNPM
- Node.js LTS

### Setup Inicial

```bash
# Clonar repositorio
gh repo clone TEMSUNAL/tems-page
cd tems-page

# Instalar dependencias
pnpm install

# (Opcional) Conectar a Strapi. Sin .env se usa contenido de ejemplo
cp .env.example .env

# Iniciar servidor de desarrollo
pnpm run dev
```

Accede a http://localhost:4321

## Flujo de Trabajo

### 1. Crear rama
Desde `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-descriptivo
```

Patrones válidos:
- `feature/navbar-responsive`
- `feature/events-list`
- `fix/hero-spacing`

### 2. Realizar cambios

- Un cambio por rama
- Commits claros y pequeños
- Seguir [Conventional Commits](#conventional-commits)

### 3. Validación antes de push

```bash
pnpm run lint    # Verificar código
pnpm run format  # Formatear automáticamente
pnpm run build   # Compilación local (recomendado)
```

**Checklist obligatorio:**
- Código formateado sin errores de lint
- Diseño responsive verificado (mobile, tablet, desktop)
- Sin código de debug o `console.log`
- Componentes reutilizables donde aplique
- Sin cambios innecesarios en otros archivos

### 4. Push y Pull Request

```bash
git push origin feature/nombre-descriptivo
```

Abre un PR hacia `develop` con:
- Descripción clara del cambio
- Capturas si es relevante
- Referencia a issues si aplica

## Conventional Commits

Estructura:
```
<tipo>: <descripción>
```

**Tipos válidos:**
- `feat:` Funcionalidad nueva
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `refactor:` Refactorización sin cambios de lógica
- `style:` Ajustes de formato
- `chore:` Tareas operativas

**Ejemplos:**
```bash
feat: agrega sección de testimonios
fix: corrige espaciado en mobile
docs: actualiza guía de desarrollo
refactor: simplifica helpers de eventos
```

## Convenciones de Código

| Elemento | Convención |
|----------|-----------|
| Componentes | PascalCase: `HeroSection.astro` |
| Variables | camelCase: `eventTitle` |
| Props | Tipadas con TypeScript |
| Estilos | TailwindCSS + clsx |
| JavaScript | Solo cuando sea necesario |

### Estructura de componentes

```astro
---
import Button from '../components/Button.astro';
import type { Event } from '../types';

type Props = {
  title: string;
  items: Event[];
};

const { title, items } = Astro.props;
---

<section class="py-12 md:py-24">
  <h2 class="text-3xl font-bold">{title}</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {items.map((item) => (
      <div key={item.id} class="border rounded-lg p-4">
        {item.name}
      </div>
    ))}
  </div>
</section>
```

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `pnpm: command not found` | Instalar: `npm install -g pnpm` |
| Puerto 4321 ocupado | Ejecutar: `pnpm run dev -- --port 3001` |
| Cambios no se reflejan | Reiniciar servidor: `Ctrl+C` y `pnpm run dev` |
| Errores de tipos | Verificar imports en `src/types/` |
| Lint falla | Ejecutar: `pnpm run format` y luego `pnpm run lint` |

## Referencias

- [Estructura del Proyecto](docs/project-structure.md)
- [Integración Strapi](docs/strapi-consumption.md)
- [Flujo Git](docs/git-workflow.md)
