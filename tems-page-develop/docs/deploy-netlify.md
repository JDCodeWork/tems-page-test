# Despliegue en Netlify y rebuild automático desde Strapi

## Cómo funciona

```
Editor publica en Strapi
        │  webhook (entry.publish / unpublish / delete)
        ▼
Netlify Build Hook ──► Netlify clona `main`, corre `pnpm run build`
        ▲                 (el build consulta Strapi con STRAPI_TOKEN)
        │                         │
GitHub Actions                     ▼
(diario + manual)            Sitio actualizado
```

- **Strapi → Netlify**: Strapi llama directamente al *build hook* de Netlify. No hace falta pasar por GitHub: el webhook de Strapi envía su propio JSON y Netlify acepta cualquier `POST`.
- **GitHub Actions** (`.github/workflows/rebuild-netlify.yml`): llama al mismo build hook **todos los días a las 5:00 a. m.** (hora Colombia), para que los eventos pasados salgan de "Próximos eventos", y permite un rebuild manual desde la pestaña *Actions*.
- Los push a `main` siguen desplegando automáticamente como cualquier sitio de Netlify.

## 1. Crear el sitio en Netlify

1. **Add new site → Import an existing project → GitHub →** `TEMSUNAL/tems-page`.
2. Rama de producción: `main`. El comando y la carpeta se leen de `netlify.toml` (`pnpm run build` → `dist`).
3. **Site configuration → Environment variables**:

   | Variable | Valor |
   |---|---|
   | `STRAPI_URL` | URL pública de Strapi, sin `/api` (ej. `https://cms.temsunal.org`) |
   | `STRAPI_TOKEN` | API token *Read-only* de Strapi |

   > Si `STRAPI_URL` no está definida, el sitio se construye con el contenido de ejemplo. Defínela antes del primer deploy de producción.

## 2. Crear el Build Hook

1. Netlify → **Site configuration → Build & deploy → Build hooks → Add build hook**.
2. Nombre: `Strapi`, rama: `main`.
3. Copia la URL (`https://api.netlify.com/build_hooks/xxxx`). **Es secreta**: quien la tenga puede lanzar builds.

## 3. Configurar el webhook en Strapi

En el admin de Strapi (proyecto `tems-page-cms`):

1. **Settings → Webhooks → Create new webhook**.
2. Name: `Netlify rebuild`.
3. URL: la del build hook.
4. Events — marcar solo:
   - Entry: `publish`, `unpublish`, `delete`
   - Media: `update`, `delete`

   (No marcar `create`/`update` de Entry: con *Draft & Publish* se dispararía un build por cada guardado de borrador.)
5. **Save** y luego **Trigger** para probar: debe aparecer un deploy en Netlify con el título *"Strapi"*.

## 4. Configurar GitHub Actions

1. GitHub → repo → **Settings → Secrets and variables → Actions → New repository secret**.
2. Nombre: `NETLIFY_BUILD_HOOK`, valor: la URL del build hook (puedes crear un segundo hook llamado `GitHub Actions` para distinguirlos en el historial de Netlify).
3. Probar: **Actions → Rebuild Netlify → Run workflow**.

> Los workflows con `schedule` solo corren desde la rama por defecto del repositorio (`main`).

### Disparar el rebuild vía API (opcional)

```bash
curl -X POST \
  -H "Authorization: Bearer <GITHUB_TOKEN>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/TEMSUNAL/tems-page/dispatches \
  -d '{"event_type":"cms-update"}'
```

## Solución de problemas

| Síntoma | Causa probable |
|---|---|
| Build falla con `[strapi] No se pudo obtener "…"` | Strapi caído, `STRAPI_URL` mal escrita o token inválido. El sitio publicado no cambia. Si Strapi está en un hosting gratuito que "duerme", el cliente reintenta 3 veces antes de fallar. |
| Error `HTTP 403` | El API token no tiene acceso a esa colección. |
| Error `HTTP 404` | El content type no existe o tiene otro nombre de API (ver [Integración Strapi](strapi-consumption.md)). |
| Se publicó contenido en Strapi pero el sitio no cambió | Revisar *Settings → Webhooks* en Strapi y *Deploys* en Netlify. |
| Las imágenes no cargan | Strapi debe ser accesible públicamente (las URLs de `/uploads` apuntan a `STRAPI_URL`) o usar un proveedor de media externo (Cloudinary, S3). |
