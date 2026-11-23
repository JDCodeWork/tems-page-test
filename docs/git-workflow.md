# Flujo Git

## Ramas

```
main     → Producción estable
develop  → Integración de features
feature/ → Nuevas funcionalidades (feature/nombre-descriptivo)
```

## Merges

- Feature → `develop` via PR (debe pasar lint y build)
- `develop` → `main` cuando está listo para producción

## Convención de commits

Usar [Conventional Commits](../CONTRIBUTING.md#conventional-commits):
- `feat:` funcionalidad nueva
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `refactor:` refactorización sin cambios de lógica
- `style:` formato
- `chore:` tareas operativas

Ejemplo: `feat: agrega sección de testimonios`

## Checklist antes de merge

- [ ] Código pasa `pnpm run lint`
- [ ] Código formateado: `pnpm run format`
- [ ] Build local sin errores: `pnpm run build`
- [ ] Sin `console.log` ni código de debug
- [ ] Responsive verificado (mobile, tablet, desktop)
- [ ] Cambios no rompen otras secciones

Ver [CONTRIBUTING.md](../CONTRIBUTING.md) para flujo detallado.

