## En progreso

_(ninguna)_

---

## MVP v1 (Etapa 0) — Híbrido Básico: Free + Pro

### Core Features

- [ ] **Auth:** Google OAuth (ya hecho ✅)
- [ ] **CRUD Rutinas:** sesiones, ejercicios, drag & drop (ya hecho ✅)
- [ ] **Log Entrenamientos:** peso, reps, series, intensidad (ya hecho ✅)
- [ ] **Historial básico:** últimos 3 meses (ya hecho ✅)
- [ ] **5 Gráficos básicos:** peso, racha, volumen, frecuencia, RPE (ya hecho ✅)
- [ ] **Import Excel:** con chat Gemini (ya hecho ✅)
- [ ] **Configuración usuario:** kg/lbs (ya hecho ✅)
- [ ] **Drag & drop ejercicios** (ya hecho ✅)

### Pagos + Tiers

- [ ] **Integración Talo:** setup producto, webhook
- [ ] **User Model:** agregar campo `plan: 'free' | 'pro'`
- [ ] **Página /pricing:** mostrar Free vs Pro
- [ ] **Tier Free:** 1 rutina, 3 meses historial, sin chat IA
- [ ] **Tier Pro ($7/mes):** rutinas ilimitadas, historial ilimitado, chat IA básico

### Chat IA

- [ ] **Endpoint /api/chat:** recibe pregunta, retorna respuesta Gemini
  - [ ] Contexto: resumen rutina + últimos 20 logs + gráficos
  - [ ] System prompt: "Eres coach de fitness..."
- [ ] **ChatsWidget:** componente de chat (input, historial, loading)
- [ ] **Gate:** `/api/chat` solo si `plan === 'pro'`
- [ ] **Ejemplos de preguntas:** sugerencias de Q&A

### UI/UX

- [ ] **Página /pricing:** responsive, mobile-first
- [ ] **Banner en Free:** "Upgrade a Pro"
- [ ] **Gates visuales:** mostrar paywall en features Pro

### Testing

- [ ] **End-to-end:** flujo completo de pago Talo
- [ ] **Mobile:** testing en iOS/Android
- [ ] **Chat IA:** calidad de respuestas

---

## Etapa 1 Validada: Tier Trainer

**Trigger:** 50+ Pro users activos

- [ ] **Tier Trainer ($20/mes):** modelo de datos
- [ ] **Dashboard de alumnos:** lista, invitación, vinculación
- [ ] **CRUD rutinas para alumnos:** crear, editar, clonar
- [ ] **Ver stats de alumnos:** todos los gráficos
- [ ] **Chat IA por alumno:** contextuado a alumno específico
- [ ] **Notificaciones:** PR superado, N días sin entrenar
- [ ] **Privacidad:** alumno acepta/rechaza, puede desvincularse

---

## Etapa 2 Validada: Export + Gráficos Avanzados

**Trigger:** 100+ Pro/Trainer users, feedback sobre export y análisis

- [ ] **Librería PDF:** instalar `pdfkit` o similar
- [ ] **POST /api/export/pdf:** genera PDF con historial + gráficos + resumen
- [ ] **POST /api/export/excel:** genera XLSX con tabs
- [ ] **POST /api/export/csv:** CSV tabulado simple
- [ ] **Página /export:** UI con botones + selector de rango
- [ ] **4 Gráficos avanzados:**
  - [ ] Balance de volumen por sesión
  - [ ] 1RM estimado
  - [ ] Detección de plateau
  - [ ] Radar muscular
- [ ] **Comparador de períodos:** período A vs B, deltas
- [ ] **Gates:** solo Pro/Trainer ven estos gráficos

---

## Etapa 3 Validada: Tier Business Launch

**Trigger:** Proof of concept en 3+ pequeños gimnasios, data sólida

- [ ] **Tier Business:** modelo de precios variable
- [ ] **Admin Dashboard:**
  - [ ] Lista de entrenadores
  - [ ] Lista de clientes
  - [ ] Reporte de adopción (%)
  - [ ] Reporte de retención
  - [ ] Analytics básicos (ejercicios populares, rutinas efectivas)
  - [ ] Bulk user management
- [ ] **Branding personalizado:**
  - [ ] Logo del gimnasio
  - [ ] Nombre custom
  - [ ] Color scheme
  - [ ] Mensajes bienvenida
- [ ] **API básica:**
  - [ ] Webhook: nuevo cliente → auto-invite
  - [ ] Webhook: cliente cancela → desactivar
  - [ ] Export datos del gimnasio
- [ ] **Soporte:**
  - [ ] Priority support (<24 hs)
  - [ ] Sesión de training inicial
  - [ ] Acompañamiento launch

---

## Etapa 4 Validada: Scale B2B

**Trigger:** 10+ pequeños gimnasios, 1-2 medianos en contrato

- [ ] **Integraciones custom:** POS, CRM, membresía
- [ ] **White-label options:** custom domain, branding avanzado
- [ ] **Equipo de soporte:** dedicated account manager
- [ ] **SLA garantizado:** 99% uptime
- [ ] **Features custom:** desarrollo según cliente
- [ ] **API avanzada:** webhooks real-time, sync

---

## Etapa 5 Validada: IA Advanced Features

**Trigger:** Chat IA adoption >80%, usuarios piden más IA

- [ ] **Análisis de mesetas automático:** widget + recomendaciones
- [ ] **Optimización de rutina automática:** sugerencias basadas en progreso
- [ ] **Generación de rutina desde cero:** user input → Gemini genera
- [ ] **Coach conversacional con memoria:** historial persistente
- [ ] **Detección de sobreentrenamiento:** alerta proactiva
- [ ] **Plan de periodización:** macrociclos automáticos

---

## Etapa 6: Features de Retención

**Trigger:** Product maduro, foco en retention

- [ ] **Notas de recuperación:** sueño, dolor previo, nutrición
- [ ] **PR automático:** detectar + celebración visual
- [ ] **Calendario de entrenamientos:** visualización mensual
- [ ] **Streaks/rachas:** gamification
- [ ] **Social (opcional):** comparar con otros users

---

## Etapa 7 (Futuro): Ecosystem & Marketplace

- [ ] **Marketplace de entrenadores:** buscar trainer local
- [ ] **Marketplace de servicios:** nutricionistas, fisioterapeutas
- [ ] **Integraciones:** Strava, MyFitnessPal, wearables
- [ ] **Monetización:** comisión en referrals
- [ ] **Premium coaching network:** red de coaches vetados

---

## Decisiones Aprobadas

✅ **4 Tiers:** Free, Pro ($7/mes), Trainer ($20/mes), Business ($400-1,200/mes)
✅ **Estrategia híbrida:** B2C + B2B simultáneo
✅ **MVP v1:** Free + Pro solamente (Etapa 0)
✅ **Chat IA:** diferencial principal desde MVP
✅ **Validación por etapa:** cada etapa requiere proof antes de siguente
✅ **Roadmap atemporal:** evolucionan según validaciones, no según tiempo

---

## Métricas de Éxito por Etapa

| Etapa | Usuario | Métrica de Éxito |
|-------|---------|------------------|
| 0 | 30-50 Pro users | NPS > 40, chat adoption > 50% |
| 1 | 50+ Pro users | Trainer conversion > 20% |
| 2 | 100+ users | Export usage > 30%, gráficos adoption > 40% |
| 3 | 3+ small gyms | Retención +2-3%, adopción > 70% |
| 4 | 10+ small gyms | SportClub/Megatlon interested |
| 5 | Chat adoption >80% | IA premium features viable |
| 6 | Product stable | Churn < 5% MoM |
| 7 | Ecosystem alive | Network effects visible |

