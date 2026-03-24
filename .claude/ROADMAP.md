# Roadmap — GymTrack (Atemporal)

> **Evolución según validaciones de mercado, no según tiempo.**
> Cada etapa se ejecuta cuando se logra la validación previa.

---

## 🎯 Visión de Producto

**Propuesta de valor:** El único tracker de gym que aprende de tu historial y te dice qué cambiar, no solo qué hiciste.

**Diferencial frente a Strong / Hevy / FitBod:**
- Esos apps registran.
- GymTrack analiza y recomienda con los datos reales del usuario.
- GymTrack se integra en el flujo del entrenador (no es una app más).

**Mercados objetivo:**
1. **Entrenadores personales independientes** (B2C)
2. **Gimnasios grandes** (B2B2C)

---

## 💰 Modelo de Negocio — Freemium Híbrido

### Tier Gratuito — Free

**Para:** Cualquiera (entrenado, entrenador, gimnasio)

**Límites:**
- 1 rutina activa
- Historial últimos 3 meses
- 5 gráficos básicos: peso, racha, volumen, frecuencia, RPE
- Import Excel/CSV (template predefinido)
- Seguimiento de 1 cliente (si eres trainer)

**Sin:**
- Chat IA
- Export de datos
- Gráficos avanzados
- Análisis de mesetas
- Historial completo

---

### Tier Pago — Pro

**Para:** Entrenadores personales que quieren más features

**Precio:** $7 USD/mes · $55 USD/año

**Incluye:**
- ✅ Rutinas ilimitadas
- ✅ Historial ilimitado
- ✅ Chat IA con Gemini (preguntas sobre tus datos)
- ✅ 4 gráficos avanzados: balance sesiones, 1RM, plateau, radar muscular
- ✅ Comparador de períodos (A vs B)
- ✅ Export datos: PDF, Excel, CSV
- ✅ Plantillas de rutinas
- ✅ Sin anuncios
- ✅ Seguimiento de hasta 20 clientes

**Features IA:**
1. Chat con tus estadísticas: "¿Estoy estancado?", "¿Balance muscular OK?"
2. Análisis de mesetas (via chat)
3. Optimización de rutina (via chat)
4. Generación de rutina desde cero (via chat)

---

### Tier Pago — Trainer

**Para:** Entrenadores personales que gestionan múltiples alumnos

**Precio:** $20 USD/mes · $160 USD/año

**Límite:** hasta 50 alumnos activos

**Incluye todo de Pro, PLUS:**

**Dashboard de alumnos:**
- Lista de todos los alumnos: última sesión, racha, adherencia
- Invitación por email o link único
- El alumno acepta/rechaza la conexión
- Alumnos en cualquier tier (Free/Pro) pueden vincularse

**Gestión:**
- Crear/editar rutinas *para* alumnos
- Clonar rutinas con ajustes
- Biblioteca privada de plantillas
- Ver todas las estadísticas de cada alumno

**IA contextuada:**
- Chat IA por alumno: "¿Está progresando Juan en sentadilla?"
- Análisis de mesetas y recomendaciones por alumno
- Sugerencias de ajuste de rutina basadas en progreso real

**Notificaciones:**
- PR superado
- N días sin entrenar
- Adherencia baja

**Privacidad:**
- Alumno da consentimiento al aceptar
- Alumno puede desvincularse en configuración
- Trainer: lectura historial, escritura rutinas

---

### Tier Pago — Business

**Para:** Gimnasios (SportClub, Megatlon, Bigg, y otros)

**Precio:** Modelo variable
- Base: $400 USD/mes (10 entrenadores + 100 clientes)
- $20 USD/trainer adicional
- $2 USD/cliente adicional (hasta el limite)
- Ejemplo: 50 trainers + 500 clientes = ~$1,000 USD/mes

**Incluye todo de Pro + Trainer, PLUS:**

**Admin Dashboard:**
- Lista de entrenadores internos
- Lista de clientes del gimnasio
- Reporte de adopción (% usando la app)
- Reporte de retención (correlación: app usage vs cancelación)
- Analytics: ejercicios más populares, rutinas efectivas
- Bulk user management (invite, remove, roles)

**Branding:**
- Logo del gimnasio en app
- Nombre custom del gimnasio
- Color scheme personalizado
- Mensajes bienvenida custom

**Integración:**
- API básica para conectar con sistema de membresía
- Webhook: nuevo cliente creado → auto-invited a app
- Webhook: cliente cancela → desactivar en app
- Export de datos del gimnasio

**Features especiales:**
- Estadísticas por grupo muscular (¿qué ejercicios entrenan más?)
- Rutinas más efectivas del gimnasio (cuáles generan retención)
- Reportes de adherencia por cliente
- Benchmark: rendimiento promedio gimnasio vs cliente

**Soporte:**
- Priority support (respuesta < 24 hs)
- Sesión de training inicial para staff
- Acompañamiento en launch
- 2-4 hs/mes de soporte táctico

**Opcional (paid add-ons):**
- Integraciones custom (POS, CRM, etc.)
- Branding avanzado (custom domain, white-label)
- Equipo de soporte dedicated
- Features custom según necesidades

---

## 📈 Roadmap de Evolución (Atemporal)

### Etapa 0: MVP v1 (Híbrido Básico)

**Objetivo:** Versión funcional que sirva para B2C + validación B2B

**Includes:**
- ✅ Auth (Google OAuth)
- ✅ CRUD rutinas (sesiones, ejercicios)
- ✅ Log de entrenamientos
- ✅ Historial básico (últimos 3 meses)
- ✅ 5 gráficos básicos
- ✅ Import Excel (con Gemini chat)
- ✅ Configuración usuario (kg/lbs)
- ✅ Drag & drop ejercicios
- ✅ Tier Free + Pro (solo 2)
- ✅ Talo integration para pagos
- ✅ Chat IA (versión simple)
- ✅ Página /pricing

**NO incluye aún:**
- ❌ Tier Trainer
- ❌ Tier Business
- ❌ Gráficos avanzados (Balance, 1RM, Plateau, Radar)
- ❌ Admin dashboard para gimnasios
- ❌ Export datos
- ❌ Comparador de períodos
- ❌ Notificaciones
- ❌ API integrations

**Validación esperada:**
- 30-50 early adopters B2C (indie trainers)
- 1-2 pequeños gimnasios en piloto (gratis)
- NPS > 40 (al menos viableee)
- Chat IA tiene adoption > 50% en Pro users

---

### Etapa 1: Tier Trainer Launch

**Trigger:**
- 50+ Pro users activos (indie trainers)
- 1-2 gimnasios pilotos con 5+ trainers usando activamente
- Feedback claro: "necesito gestionar múltiples clientes"

**Qué agregar:**
- ✅ Tier Trainer ($20/mes)
- ✅ Dashboard de alumnos (lista, invitación, tracking)
- ✅ CRUD rutinas para alumnos
- ✅ Ver estadísticas de alumnos
- ✅ Chat IA por alumno
- ✅ Notificaciones: PR, inactividad

**Validación esperada:**
- 10-20 Trainers convertidos a tier Trainer
- Adopción de alumnos > 60%
- Retención de alumnos mejoró
- Feedback para features adicionales

---

### Etapa 2: Export + Gráficos Avanzados

**Trigger:**
- 100+ Pro/Trainer users activos
- Feedback recurrente: "necesito exportar", "quiero ver más análisis"
- Gimnasios pequeños dicen: "esto podría funcionar en toda la cadena si tiene estos gráficos"

**Qué agregar:**
- ✅ Export PDF/Excel/CSV
- ✅ Comparador de períodos (A vs B)
- ✅ 4 gráficos avanzados:
  - Balance de volumen por sesión
  - 1RM estimado
  - Detección de plateau
  - Radar muscular
- ✅ Página /export con UI
- ✅ Gates: solo Pro/Trainer ven estos

**Validación esperada:**
- Export usage > 30% en Pro users
- Gráficos generan engagement adicional
- Gimnasios dicen: "esto funciona"

---

### Etapa 3: Tier Business Launch

**Trigger:**
- Proof of concept sólido con 3+ pequeños gimnasios
- Data clara: adopción > 70%, retención mejoró 2-3%
- Demanda inbound de gimnasios medianos

**Qué agregar:**
- ✅ Tier Business ($400-1,200 USD/mes)
- ✅ Admin dashboard (usuarios, adopción, analytics)
- ✅ Bulk user management
- ✅ Branding personalizado
- ✅ API básica para integraciones
- ✅ Webhooks: membresía ↔ app sync
- ✅ Priority support
- ✅ Reportes de adopción/retención

**Validación esperada:**
- 5-10 pequeños gimnasios pagando
- 1-2 gimnasios medianos en piloto
- Data de retención + adopción
- Feedback para customizaciones

---

### Etapa 4: Scale B2B

**Trigger:**
- 10+ gimnasios pequeños pagando
- 1-2 medianos en contrato
- Demand para grandes cadenas (SportClub, Megatlon)

**Qué agregar:**
- ✅ Integraciones custom (POS, CRM, membresía)
- ✅ White-label options
- ✅ Custom domain hosting
- ✅ Equipo de soporte dedicated
- ✅ SLA garantizado (99% uptime)
- ✅ Features custom por cliente
- ✅ API avanzada (webhooks, sync real-time)
- ✅ Onboarding + training program

**Validación esperada:**
- SportClub firma contrato
- Megatlon en piloto
- Revenue B2B > B2C

---

### Etapa 5: IA Advanced Features

**Trigger:**
- Usuarios piden más IA
- Chat IA tiene adoption > 80% en Pro/Trainer
- Business models estable

**Qué agregar:**
- ✅ Análisis de mesetas automático (widget en dashboard)
- ✅ Optimización de rutina automática
- ✅ Generación de rutina desde cero
- ✅ Coach conversacional con memoria
- ✅ Detección de sobreentrenamiento
- ✅ Plan de periodización automático

**Validación esperada:**
- IA features aumentan engagement
- Usuarios pagan más por IA (tier separada?)
- Retention mejora

---

### Etapa 6: Features de Retención

**Trigger:**
- Product está maduro
- Foco en retención de usuarios existentes

**Qué agregar:**
- ✅ Notas de recuperación (sueño, dolor previo)
- ✅ PR automático (celebración visual)
- ✅ Calendario de entrenamientos
- ✅ Streaks/rachas gamification
- ✅ Social: comparar con otros users (optional)

**Validación esperada:**
- Churn reduce
- Engagement sube
- Usuarios más motivados

---

### Etapa 7: Ecosystem & Marketplace (Futuro)

**Trigger:**
- Eres ya un jugador establecido
- Usuarios piden más features

**Qué agregar:**
- ✅ Marketplace de entrenadores (buscar trainer local)
- ✅ Marketplace de servicios (nutricionistas, fisioterapeutas)
- ✅ Integración con apps (Strava, MyFitnessPal, wearables)
- ✅ Monetización: comisión en referrals
- ✅ Premium coaching network

**Validación esperada:**
- Network effects
- Revenue diversification

---

## 🎯 Matriz de Decisión: ¿Cuándo Pasar a Siguiente Etapa?

| Etapa | Métrica Éxito | Validación |
|-------|---------------|-----------|
| **0 → 1** | 50+ Pro users | Adopción Trainer > 20% conversion |
| **1 → 2** | 100+ users activos | Adopción gráficos > 30%, gimnasios piden features |
| **2 → 3** | Proof PoC en 3+ gyms | Retención +2-3%, adopción > 70% |
| **3 → 4** | 10+ small gyms | Inbound demand, SportClub interested |
| **4 → 5** | Revenue B2B stable | Chat IA adoption > 80%, users piden IA |
| **5 → 6** | IA features adopted | Churn rate baja, engagement sube |
| **6 → 7** | Product mature | Users ask for ecosystem features |

---

## 📊 Proyección de Revenue (Indicativa)

```
Etapa 0: $0 (MVP validation)
Etapa 1: $500-2,000 USD/mes (50-100 Trainer users)
Etapa 2: $2,000-5,000 USD/mes (export + gráficos drive engagement)
Etapa 3: $5,000-15,000 USD/mes (10+ small gyms + Pro/Trainer users)
Etapa 4: $15,000-50,000 USD/mes (medium gyms + SportClub interest)
Etapa 5: $50,000-100,000 USD/mes (IA premium features)
Etapa 6: $100,000+ USD/mes (stable, profitable)
```

---

## 🎯 Estrategia Simultánea

**Mientras ejecutas Etapa N:**
- Recolecta feedback para Etapa N+1
- Build early features de Etapa N+1 (en background)
- Valida supuestos con usuarios

**No esperes a terminar Etapa 100% antes de empezar N+1.**
Overlap strategic es normal.

---

## ⚠️ Decisiones Críticas

1. **B2C es validación, B2B es escala** — enfoque 70% en B2B timing
2. **Cada etapa requiere validación antes de invertir** — no hagas features sin proof
3. **Usuario paga, usuario valida** — first paying customer es muy importante
4. **Gimnasios no son rápido, pero son escalable** — paciencia
5. **Chat IA es el diferencial** — mantente obsesionado

