#!/usr/bin/env bash
# Sincroniza la rama actual con su remoto: pull -> add -> commit -> push

set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

info() { printf '\e[1m[NOTA]\e[0m %s\n' "$*"; }
ok()   { printf '\e[1;32m[OK]\e[0m %s\n' "$*"; }
err()  { printf '\e[1;31m[ERROR]\e[0m %s\n' "$*" >&2; }
confirm() {
    local r
    read -rp $'\t'"$1 (S/n) " r
    [[ -z "$r" || "$r" =~ ^[YySs] ]]
}

branch=$(git branch --show-current)
if [[ -z "$branch" ]]; then
    err "HEAD está desacoplado (detached); cámbiate a una rama primero."
    exit 1
fi

upstream=$(git rev-parse --abbrev-ref '@{u}' 2>/dev/null || true)

# 1. Pull si hay commits nuevos en el remoto
if [[ -n "$upstream" ]]; then
    git fetch --quiet || err "No se pudo hacer fetch (¿sin conexión?). Se usará el estado local."

    behind=$(git rev-list --count 'HEAD..@{u}')
    if (( behind > 0 )); then
        info "La rama está $behind commit(s) por detrás de $upstream."
        if confirm "¿Desea realizar 'git pull --rebase'?"; then
            if git pull --rebase --autostash; then
                ok "Pull realizado con éxito."
            else
                err "El pull falló. Resuelve los conflictos y vuelve a ejecutar el script."
                exit 1
            fi
        fi
    fi
fi

# 2. Stage de cambios
# Cambios sin stage (modificados/eliminados) o archivos nuevos sin rastrear
if ! git diff --quiet || [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
    info "Se encontraron archivos que no están en el staging:"
    git status -s | sed 's/^/\t/'
    if confirm "¿Desea realizar 'git add -A'?"; then
        git add -A && ok "Archivos agregados al staging."
    fi
fi

# 3. Commit
if ! git diff --cached --quiet; then
    info "Hay cambios en el staging sin commit."
    if confirm "¿Desea realizar el commit?"; then
        while :; do
            read -rp $'\t'"Título del commit: " title
            (( ${#title} >= 6 )) && break
            err "Título demasiado corto. Usa un nombre que describa qué se actualizó o modificó."
        done
        read -rp $'\t'"Descripción (opcional): " desc

        args=(-m "$title")
        [[ -n "$desc" ]] && args+=(-m "$desc")

        printf '\tSe ejecutará:\n\t\t\e[1m$\e[0m git commit'
        printf ' -m "%s"' "$title"
        [[ -n "$desc" ]] && printf ' -m "%s"' "$desc"
        printf '\n'

        if confirm "¿Desea continuar?"; then
            if git commit "${args[@]}"; then
                ok "Commit realizado con éxito."
            else
                err "El commit falló."
                exit 1
            fi
        else
            exit 0
        fi
    fi
fi

# 4. Push
if [[ -z "$upstream" ]]; then
    if (( $(git rev-list --count HEAD) > 0 )); then
        info "La rama '$branch' no tiene upstream."
        if confirm "¿Desea publicarla con 'git push -u origin $branch'?"; then
            if git push -u origin HEAD; then
                ok "Rama publicada con éxito."
            else
                err "El push falló."
                exit 1
            fi
        fi
    fi
else
    ahead=$(git rev-list --count '@{u}..HEAD')
    if (( ahead > 0 )); then
        info "La rama está $ahead commit(s) por delante de $upstream."
        if confirm "¿Desea realizar push?"; then
            if git push; then
                ok "Push realizado con éxito."
            else
                err "El push falló (¿el remoto tiene cambios nuevos?)."
                exit 1
            fi
        fi
    fi
fi

exit 0
