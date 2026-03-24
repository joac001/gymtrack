---
name: Primeros 5 Pasos — MVP Launch
description: Pasos concretos y ordenados para lanzar el MVP Final
type: project
---

# 🚀 Primeros 5 Pasos — MVP Final Launch

> **Orden exacto de ejecución. No es negociable.**

---

## Paso 1: Setup Talo (Infraestructura de Pagos)

### Qué hacer:
1. **Ir a https://talo.com.ar/**
2. **Crear cuenta** (email, teléfono)
3. **Crear producto "GymTrack Pro"**
   - Nombre: "GymTrack Pro"
   - Precio: $7 USD/mes
   - Descripción: "Chat IA, historial ilimitado, gráficos avanzados"
4. **Copiar API keys:**
   - Public key (TALO_PUBLIC_KEY)
   - Secret key (TALO_SECRET_KEY)
5. **Obtener URL de checkout** (ejemplo: `checkout.talo.com.ar/...`)
6. **Copiar webhook URL** para recibir eventos de pago

### Entregables:
- ✅ Cuenta Talo activa
- ✅ Producto creado
- ✅ API keys en .env.local
- ✅ Webhook URL anotada

### Tiempo: 30 minutos

---

## Paso 2: Agregar Campo `plan` al User Model

### Qué hacer:
1. **Abrir `src/models/User.ts`**
2. **Agregar campos:**
   ```typescript
   plan: {
     type: String,
     enum: ['free', 'pro'],
     default: 'free'
   },
   planExpiresAt: {
     type: Date,
     default: null
   },
   planStartedAt: {
     type: Date,
     default: null
   }
   ```
3. **Agregar índice si es necesario** (para queries rápidas)
4. **Crear migration** (opcional pero recomendado)
5. **Verificar que compila** sin errores TypeScript

### Entregables:
- ✅ User model actualizado
- ✅ Sin errores TypeScript
- ✅ BD lista para nuevos campos

### Tiempo: 1 hora

---

## Paso 3: Crear Página `/pricing`

### Qué hacer:
1. **Crear `src/app/(app)/pricing/page.tsx`**
   - Server Component
   - Mostrar Free vs Pro lado a lado
   - Features checklist por tier
   - Botones "Get Started" (Free) y "Upgrade to Pro" (Pro)

2. **Diseño:**
   ```
   ┌─────────────────────────────────┐
   │         Free      │      Pro     │
   │        $0         │    $7/mes    │
   │                   │              │
   │ Features:         │ Features:    │
   │ ✓ 1 rutina       │ ✓ Rutinas ∞  │
   │ ✓ 3 meses hist  │ ✓ Historial ∞│
   │ ✗ Chat IA       │ ✓ Chat IA    │
   │ ✓ 5 gráficos    │ ✓ Sin anuncios
   │                  │              │
   │ [Get Started]    │ [Upgrade] →  │
   └─────────────────────────────────┘
   ```

3. **Mobile first** — responsive desde móvil
4. **Link "Upgrade"** → `createCheckoutSession` (lo haremos en Paso 4)

### Entregables:
- ✅ `/pricing` página funcional
- ✅ Responsive en móvil
- ✅ Botones listos (aún sin callback)

### Tiempo: 2 horas

---

## Paso 4: Implementar Webhook + Gates

### 4A: Endpoint para Crear Sesión de Pago

**Qué hacer:**
1. **Crear `src/app/api/checkout/route.ts`**
   ```typescript
   POST /api/checkout
   Request: { planId: 'pro' }
   Response: { checkoutUrl: 'https://checkout.talo.com...' }
   ```

2. **Lógica:**
   - Validar user autenticado
   - Crear sesión en Talo
   - Retornar URL de checkout
   - Talo redirige a usuario a checkout
   - Después de pago, Talo redirige a `/dashboard?payment=success`

3. **Verificar funcionamiento** con Talo test mode

### Entregables:
- ✅ Endpoint `/api/checkout` funcional
- ✅ Integración Talo completa
- ✅ Flujo de pago testeable

---

### 4B: Webhook para Actualizar `user.plan`

**Qué hacer:**
1. **Crear `src/app/api/webhooks/talo/route.ts`**
   ```typescript
   POST /api/webhooks/talo
   Recibe evento de Talo (pago completado)
   Actualiza user.plan = 'pro'
   Retorna 200 OK
   ```

2. **Lógica:**
   - Verificar firma webhook (security)
   - Obtener user ID del evento
   - Actualizar `user.plan = 'pro'`
   - Actualizar `planStartedAt` y `planExpiresAt`

3. **Registrar webhook URL en Talo**

### Entregables:
- ✅ Webhook recibiendo eventos de Talo
- ✅ Usuario actualizado a 'pro' después de pago
- ✅ Testing en modo producción

---

### 4C: Gates en API Routes

**Qué hacer:**
1. **En `/api/chat`:**
   ```typescript
   const session = await auth()
   const user = await User.findById(session.user.id)
   if (user.plan !== 'pro') {
     return NextResponse.json({ error: 'Pro required' }, { status: 403 })
   }
   // continuar con chat
   ```

2. **En otros endpoints Pro:**
   - `/api/export/*`
   - Futuro: `/api/trainer/*`
   - Futuro: `/api/business/*`

### Entregables:
- ✅ `/api/chat` protegido (solo Pro)
- ✅ Otros endpoints con gates listos
- ✅ Testing: Free user intenta acceder → error 403

---

### Tiempo (4A + 4B + 4C): 3 horas

---

## Paso 5: Implementar Chat IA Widget + Endpoint

### 5A: Endpoint `/api/chat`

**Qué hacer:**
1. **Crear `src/app/api/chat/route.ts`**
   ```typescript
   POST /api/chat
   Request: { message: string, history?: Message[] }
   Response: { response: string }
   ```

2. **Lógica:**
   - Validar user es Pro
   - Obtener últimos 20 logs del user
   - Obtener rutina actual
   - Obtener gráficos (peso, volumen, RPE)
   - Enviar contexto + pregunta a Gemini
   - Retornar respuesta

3. **System Prompt:**
   ```
   "Eres un coach de fitness experto. El usuario te pregunta sobre sus datos reales.
   Analiza sus logs, gráficos y rutina. Responde en español. Sé conciso y práctico.
   Sugiere acciones específicas (cambiar rep range, deload, aumentar frecuencia, etc.)"
   ```

### Entregables:
- ✅ Endpoint `/api/chat` funcional
- ✅ Gemini integration
- ✅ Respuestas coherentes a preguntas de fitness

---

### 5B: ChatsWidget Componente

**Qué hacer:**
1. **Crear `src/components/chat/ChatsWidget.tsx`**
   - Input text + botón enviar
   - Historial de mensajes (user + assistant)
   - Loading state (skeleton animado)
   - Ejemplos de preguntas sugeridas

2. **Estructura:**
   ```
   ┌────────────────────────────────┐
   │      GymTrack Chat IA          │
   ├────────────────────────────────┤
   │ Preguntas que puedo responder: │
   │ • ¿Estoy estancado?            │
   │ • ¿Cómo está mi balance?       │
   │ • ¿Cuándo fue mi mejor semana? │
   ├────────────────────────────────┤
   │ [Historial de chat]            │
   │ User: ¿Estoy estancado?        │
   │ IA: Basándome en tus datos...  │
   ├────────────────────────────────┤
   │ [Input] [Enviar]               │
   └────────────────────────────────┘
   ```

3. **Ubicación:** En `/estadisticas` página o en `/coach`
4. **Mobile first:** Responsive, teclado en móvil

### Entregables:
- ✅ ChatsWidget funcional
- ✅ Historial de chat en sesión
- ✅ Ejemplos de preguntas
- ✅ Responsive en móvil

---

### 5C: Gate Visual (Paywall)

**Qué hacer:**
1. **Si user NO es Pro:**
   - Mostrar botón deshabilitado "Chat IA (Pro only)"
   - Mostrar tooltip o modal: "Actualiza a Pro para usar Chat IA"
   - Botón "Upgrade a Pro" → redirige a `/pricing`

2. **Si user ES Pro:**
   - ChatsWidget normal

### Entregables:
- ✅ Paywall visual funcional
- ✅ Botón "Upgrade" redirige a `/pricing`

---

### Tiempo (5A + 5B + 5C): 4 horas

---

## 📋 Resumen: Los 5 Pasos

| Paso | Qué | Tiempo | Entregable |
|------|-----|--------|-----------|
| 1 | Setup Talo | 30 min | API keys, webhook URL |
| 2 | User.plan field | 1 h | Model actualizado |
| 3 | Página /pricing | 2 h | UI completa |
| 4 | Webhook + gates | 3 h | Pagos funcionando |
| 5 | Chat IA | 4 h | Widget + endpoint |
| **Total** | **MVP completo** | **~10-11 h** | **Lanzable** |

---

## ✅ Checklist Antes de Lanzar

- [ ] Talo cuenta activa, producto creado
- [ ] User model tiene `plan` field
- [ ] `/pricing` página responsiva
- [ ] `/api/checkout` crea sesión Talo
- [ ] `/api/webhooks/talo` actualiza user.plan
- [ ] `/api/chat` retorna respuestas de Gemini
- [ ] ChatsWidget renderiza correctamente
- [ ] Gates: Free user no puede usar chat
- [ ] Gates: Pro user ve chat normal
- [ ] Testing end-to-end: signup → upgrade → chat
- [ ] Mobile testing: iOS + Android simulado
- [ ] Performance: chat response < 3 segundos

---

## 🎯 Después de Completar Los 5 Pasos

### Tienes:
- ✅ MVP funcional
- ✅ Pagos funcionando (Talo)
- ✅ Chat IA (diferencial)
- ✅ 2 tiers (Free + Pro)
- ✅ Gates implementados
- ✅ Listo para lanzar

### Luego:
1. **Testing manual 24 horas**
2. **Invitar 10 early adopters** (amigos, familia)
3. **Recolectar feedback**
4. **Lanzamiento oficial**
5. **Medir métricas: conversión, adoption, NPS**

---

## 🚨 Orden de Ejecución

**NO HAGAS:**
- ❌ Chat IA sin Talo (sin pagos = sin ingresos)
- ❌ Página /pricing sin webhook (pagos incompletos)
- ❌ Gates en chat sin endpoint (no funciona)

**HAZ EN ESTE ORDEN:**
1. Talo setup
2. User model
3. /pricing page
4. Webhook + gates
5. Chat IA

**Así aseguras que cada paso funciona ANTES de siguiente.**

