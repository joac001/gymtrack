---
name: Git Workflow — Desarrollo por Etapas
description: Proceso de branches, commits y deploys para GymTrack
type: project
---

# 🔄 Git Workflow — Desarrollo por Etapas

> **Proceso de desarrollo estructurado: branch por etapa → commits atómicos → merge a main → siguiente etapa**

---

## 📋 Flujo General

```
main (siempre estable)
  ↓
feature/etapa-0-mvp (desarrollo)
  ├─ Commit: Setup Talo
  ├─ Commit: User model plan field
  ├─ Commit: /pricing page
  ├─ Commit: Webhook + gates
  ├─ Commit: Chat IA
  └─ [PUSH] + [Merge a main]
    ↓
feature/etapa-1-trainer (siguiente)
  ├─ Commit: Tier Trainer model
  ├─ Commit: Dashboard de alumnos
  └─ ...
```

---

## 🌳 Convención de Nombres de Branches

### Etapas del Roadmap

```
feature/etapa-0-mvp
feature/etapa-1-trainer
feature/etapa-2-export
feature/etapa-3-business
feature/etapa-4-scale-b2b
feature/etapa-5-ia-advanced
feature/etapa-6-retention
feature/etapa-7-ecosystem
```

### Features Dentro de Etapa (Si es muy grande)

```
feature/etapa-0-mvp/talo-setup
feature/etapa-0-mvp/chat-ia
feature/etapa-0-mvp/pricing-page
```

**Patrón:** `feature/[etapa]-[descripción]`

---

## 💾 Commits Atómicos (Importantes)

### Qué es Atómico

**Cada commit debe:**
- ✅ Ser funcional (no rompe la app)
- ✅ Representar UN cambio lógico
- ✅ Tener mensaje claro de qué cambió
- ✅ No mezclar features no relacionadas

### Ejemplos BUENOS

```
✅ feat: add Talo webhook endpoint
✅ feat: add plan field to User model
✅ feat: create /pricing page
✅ feat: implement chat IA gateway
✅ fix: chat response timeout handling
✅ refactor: extract chat context builder
```

### Ejemplos MALOS

```
❌ feat: todo
❌ fix: bugs
❌ changes
❌ feat: talo + user model + pricing + chat (megacommit)
```

### Formato de Mensaje

```
<tipo>: <descripción corta>

<descripción larga opcional>

Ejemplo:
feat: add Talo webhook for plan upgrades

- Create POST /api/webhooks/talo
- Verify webhook signature
- Update user.plan to 'pro'
- Handle payment completed event

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

**Tipos:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

---

## 🔐 Revisión de Datos Sensibles (CRÍTICO)

### Antes de Cada PUSH

**Checklist obligatorio:**

```bash
# 1. Ver qué archivos voy a pushear
git diff --cached --name-only

# 2. Ver contenido de archivos modificados
git diff --cached

# 3. Buscar strings sospechosos
git diff --cached | grep -E "(password|secret|key|token|api_key)"

# 4. Revisar .env (nunca debe estar)
git status | grep ".env"
```

### Qué NUNCA Pushear

```
❌ .env (vars de ambiente)
❌ .env.local
❌ API keys (Talo, Gemini, etc.)
❌ Tokens de sesión
❌ Credenciales de BD
❌ Certificados
❌ Private keys
```

### Qué Pushear

```
✅ .env.example (template sin valores)
✅ Código fuente
✅ package.json
✅ TypeScript configs
✅ Documentación
```

### Si Accidentalmente Pusheaste Sensible

```bash
# 1. INMEDIATAMENTE revocar las keys en Talo/Gemini
# 2. Regenerar todas las credenciales
# 3. Usar git filter-branch o BFG para limpiar historio
# 4. Force push (últimmo recurso, último argumento)
```

**Recomendación:** Usar `git-secrets` para prevenir

```bash
# Instalar
brew install git-secrets

# Configurar para el proyecto
git secrets --install
git secrets --register-aws  # si usas AWS

# Añadir patterns custom
git secrets --add '(TALO_SECRET|GEMINI_API_KEY)'
```

---

## 📤 Proceso Paso a Paso

### 1️⃣ Crear Branch de Etapa

```bash
# Asegurar que estamos en main y está actualizado
git checkout main
git pull origin main

# Crear branch de etapa
git checkout -b feature/etapa-0-mvp
```

---

### 2️⃣ Desarrollo con Commits Atómicos

**Durante el desarrollo:**

```bash
# Hacer cambio #1
# Editar: src/models/User.ts
git add src/models/User.ts
git commit -m "feat: add plan field to User model"

# Hacer cambio #2
# Editar: src/app/(app)/pricing/page.tsx
git add src/app/\(app\)/pricing/page.tsx
git commit -m "feat: create /pricing page with Free vs Pro comparison"

# Hacer cambio #3
# Editar: src/app/api/webhooks/talo/route.ts
git add src/app/api/webhooks/talo/route.ts
git commit -m "feat: implement Talo webhook for plan upgrades"

# Ver historial
git log --oneline
# output:
# abc1234 feat: implement Talo webhook for plan upgrades
# def5678 feat: create /pricing page with Free vs Pro comparison
# ghi9012 feat: add plan field to User model
```

---

### 3️⃣ Antes de Push: Revisar Sensibles

```bash
# Ver qué voy a pushear
git diff main...HEAD --name-only

# Revisar cambios en detalle
git diff main...HEAD

# Buscar posibles sensibles
git diff main...HEAD | grep -E "(password|secret|TALO|GEMINI|api)"

# Si hay .env stagheado, REMOVE
git status | grep ".env"
git rm --cached .env  # Si está en git
```

---

### 4️⃣ Push a GitHub

```bash
# Pushear branch
git push -u origin feature/etapa-0-mvp

# Después del primer push, solo:
git push

# Ver rama en GitHub (debería aparecer auto)
# GitHub te ofrece "Create Pull Request" automáticamente
```

---

### 5️⃣ Merge a Main (Local Primero, Luego Push)

```bash
# Asegurar que main esté actualizado
git checkout main
git pull origin main

# Mergear la rama
git merge feature/etapa-0-mvp

# Ver log para confirmar
git log --oneline -10

# Pushear main con los cambios
git push origin main
```

---

### 6️⃣ Limpiar la Rama Vieja (Opcional)

```bash
# Eliminar rama local
git branch -d feature/etapa-0-mvp

# Eliminar rama en GitHub
git push origin --delete feature/etapa-0-mvp
```

---

### 7️⃣ Crear Siguiente Etapa

```bash
# Asegurar que estamos en main actualizado
git checkout main
git pull origin main

# Crear rama para Etapa 1
git checkout -b feature/etapa-1-trainer

# Continuar desarrollo
```

---

## 📊 Visualización del Flujo

```
main
├─ Commit: Initial setup (antes de MVP)
│
├─ [feature/etapa-0-mvp]
│  ├─ Commit: Setup Talo
│  ├─ Commit: User model plan field
│  ├─ Commit: /pricing page
│  ├─ Commit: Webhook + gates
│  ├─ Commit: Chat IA
│  └─ PUSH + MERGE
│
├─ Merge commit: Merge feature/etapa-0-mvp
│
├─ [feature/etapa-1-trainer]
│  ├─ Commit: Trainer model
│  ├─ Commit: Dashboard alumnos
│  ├─ Commit: Chat por alumno
│  └─ PUSH + MERGE
│
├─ Merge commit: Merge feature/etapa-1-trainer
│
├─ [feature/etapa-2-export]
│  └─ ...
│
└─ ...tags: v1.0.0, v1.1.0, v1.2.0
```

---

## 🏷️ Tags (Para Releases)

### Después de Mergear Etapa a Main

```bash
# Ver versión actual
git describe --tags

# Crear tag para release
git tag -a v1.0.0 -m "MVP v1: Free + Pro + Chat IA"
git tag -a v1.1.0 -m "Etapa 1: Tier Trainer"
git tag -a v1.2.0 -m "Etapa 2: Export + Gráficos"

# Pushear tags
git push origin --tags

# Ver tags
git tag -l
```

---

## 🔄 Workflow en Resumen

```
1. git checkout -b feature/etapa-X
2. Desarrollar con commits atómicos
3. Revisar sensibles (git-secrets)
4. git push -u origin feature/etapa-X
5. Crear Pull Request en GitHub (visual check)
6. git checkout main && git merge feature/etapa-X
7. git push origin main
8. Crear tag: git tag -a vX.Y.Z
9. Siguiente: git checkout -b feature/etapa-Y
```

---

## ⚠️ Errores Comunes

### ❌ Pushear .env

```bash
# Si lo hiciste:
git rm --cached .env
git commit -m "chore: remove .env from tracking"
# Pero las credenciales ya están en historial!
# Solución: revocar keys en Talo/Gemini
```

### ❌ Megacommit

```bash
# MAL: feat: everything done
# BIEN:
# feat: add Talo setup
# feat: add User plan field
# feat: create /pricing page
# etc.
```

### ❌ Mergear sin Estar en Main

```bash
# MAL
git merge feature/etapa-0-mvp  # (mientras estás en feature/etapa-1)

# BIEN
git checkout main
git merge feature/etapa-0-mvp
```

### ❌ Olvidar Pull Antes de Push

```bash
# MAL
git push  # si alguien hizo push a main antes

# BIEN
git checkout main
git pull origin main
git merge feature/etapa-X
git push
```

---

## 🛠️ Setup Útil (Opcional)

### .gitignore (Si no existe)

```
.env
.env.local
.env.*.local
node_modules/
.next/
dist/
.DS_Store
*.log
.idea/
```

### Git Hooks (Pre-commit)

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Prevenir commit de .env
if git diff --cached --name-only | grep -E "\.env"; then
  echo "Error: .env no debe ser commiteado"
  exit 1
fi

# Prevenir commits sin mensajes
if [ -z "$(git diff --cached)" ]; then
  echo "Error: No hay cambios a commitear"
  exit 1
fi
```

---

## 📝 GitHub Actions (Futuro Opcional)

```yaml
# .github/workflows/security.yml
name: Security Check

on: [pull_request]

jobs:
  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: gitleaks/gitleaks-action@v2
```

Previene pushes con secrets automáticamente.

---

## ✅ Checklist Antes de Push

- [ ] Commits son atómicos (1 cambio = 1 commit)
- [ ] Mensajes de commit claros
- [ ] No hay .env en staging
- [ ] No hay API keys en código
- [ ] `git diff --cached` no contiene "password", "secret", "key"
- [ ] Tests pasan (si hay)
- [ ] Código compila sin errores TypeScript
- [ ] Branch está actualizado con main (si necesario merge)

