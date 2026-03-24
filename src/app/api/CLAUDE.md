# API Routes — Endpoints & Controllers

> **Contexto cargado cuando trabajas con rutas API, autenticación, y endpoints.**

---

## Estructura

```
src/app/api/
├─ auth/
│  ├─ [...nextauth]/route.ts    ← NextAuth handler
│  └─ register/route.ts          ← Registro custom
├─ user/
│  └─ settings/route.ts          ← GET/PATCH unidadPeso
├─ chat/
│  └─ route.ts                   ← POST chat IA
├─ checkout/
│  └─ route.ts                   ← POST crear sesión Talo
├─ webhooks/
│  ├─ talo/route.ts              ← Webhook actualizar plan
│  └─ stripe/route.ts            ← (futuro si migramos a Stripe)
├─ import/
│  ├─ chat/route.ts              ← POST chat Gemini import
│  └─ confirm/route.ts           ← POST persistir import
├─ ejercicios/
│  └─ musculos/route.ts          ← POST clasificación muscular
├─ estadisticas/
│  └─ route.ts                   ← (si hay endpoint de stats)
└─ CLAUDE.md (este)
```

---

## Patrones Comunes

### Autenticación & Session

```typescript
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Obtener sesión
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // ... resto de lógica
  return NextResponse.json({ data: ... })
}
```

### Validación de Plan

```typescript
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const user = await User.findById(session.user.id)

  // Gate: solo Pro
  if (user.plan !== 'pro') {
    return NextResponse.json(
      { error: 'Pro plan required' },
      { status: 403 }
    )
  }

  // ... resto de lógica
}
```

### Manejo de Errores

```typescript
try {
  const data = await req.json()
  // validaciones...
  const resultado = await procesar(data)
  return NextResponse.json(resultado)
} catch (error) {
  console.error('[/api/endpoint] Error:', error)
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Unknown error' },
    { status: 500 }
  )
}
```

---

## Endpoints Clave

### `POST /api/chat` — Chat IA

**Request:**
```typescript
{
  message: string
  history?: { role: 'user' | 'assistant', content: string }[]
}
```

**Response:**
```typescript
{
  response: string
  usage?: { input_tokens: number, output_tokens: number }
}
```

**Lógica:**
1. Validar user es Pro
2. Obtener últimos 20 logs del user
3. Obtener rutina activa
4. Obtener gráficos stats
5. Construir contexto para Gemini
6. Llamar Gemini con pregunta
7. Retornar respuesta

**Ver:** `src/lib/gemini-musculos.ts` para patrón de contexto

---

### `POST /api/checkout` — Crear Sesión Talo

**Request:**
```typescript
{
  planId: 'pro'  // futuro: 'trainer', 'business'
}
```

**Response:**
```typescript
{
  checkoutUrl: 'https://checkout.talo.com.ar/...'
}
```

**Lógica:**
1. Validar user autenticado
2. Crear sesión en Talo
3. Retornar URL de checkout
4. Talo redirige a user a checkout
5. Después de pago, Talo redirige a `/dashboard?payment=success`

---

### `POST /api/webhooks/talo` — Recibir Pago

**Request (desde Talo):**
```typescript
{
  type: 'payment.completed',
  data: {
    userId: string
    planId: 'pro'
    transactionId: string
    amount: number
  },
  signature: string  // para verificar autenticidad
}
```

**Lógica:**
1. Verificar firma webhook (security)
2. Validar que sea payment.completed
3. Obtener userId y planId del evento
4. Actualizar: `user.plan = planId`, `planStartedAt = now`, `planExpiresAt = now + 1 month`
5. Retornar 200 OK

**Ver:** `WORKFLOW.md` para handling de credenciales

---

### `POST /api/ejercicios/musculos` — Clasificación Muscular

**Request:**
```typescript
{
  nombres: string[]  // ej: ["Bench Press", "Barbell Row"]
}
```

**Response:**
```typescript
{
  clasificacion: {
    "benchpress": [
      { nombre: "Pecho", porcentaje: 70 },
      { nombre: "Hombros", porcentaje: 20 }
    ],
    "barbellrow": [
      { nombre: "Espalda", porcentaje: 80 },
      { nombre: "Bíceps", porcentaje: 20 }
    ]
  }
}
```

**Lógica:**
1. Normalizar cada nombre (`normalizarNombre`)
2. Consultar caché (EjercicioMusculos)
3. Para nombres no en caché: llamar Gemini
4. Persistir nuevos en EjercicioMusculos
5. Retornar mapa completo (caché + nuevos)

---

### `POST /api/import/chat` — Chat Gemini Import

**Request Ronda 1:**
```typescript
{
  file: File  // Excel uploadado
}
```

**Request Ronda 2-3:**
```typescript
{
  excelBase64: string       // Excel encoded
  historial: RondaHistorial[] // Preguntas/respuestas previas
}
```

**Response:**
```typescript
{
  status: 'needs_more_info' | 'ready',
  excelBase64: string,  // para rondas siguientes
  preguntas?: PreguntaImport[],  // si needs_more_info
  rutinas?: RutinaImport[],      // si ready
  logs?: LogImport[]             // si ready
}
```

**Lógica:**
1. Parsear Excel a texto (parseExcel + sheetsToText)
2. Llamar Gemini con historial
3. Si Gemini devuelve preguntas: retornar `status: needs_more_info`
4. Si Gemini devuelve resultado estructurado: retornar `status: ready`
5. Máximo 3 rondas de conversación

---

### `POST /api/import/confirm` — Persistir Import

**Request:**
```typescript
{
  rutinas: RutinaImport[],
  logs: LogImport[],
  ajustes: Record<string, any>  // valores de inputs del usuario
}
```

**Response:**
```typescript
{
  ok: true,
  rutinasCreadas: number,
  logsCreados: number,
  rutinaIds: string[]
}
```

**Lógica:**
1. Crear rutinas en MongoDB (con `activa: false`)
2. Mapear nombres de sesión a IDs creados
3. Crear WorkoutLogs (con desnormalización)
4. Si log no tiene fecha, calcular desde `fechaIndice`
5. Retornar stats

---

### `GET /api/user/settings` — Obtener Configuración

**Response:**
```typescript
{
  unidadPeso: 'kg' | 'lbs'
}
```

---

### `PATCH /api/user/settings` — Actualizar Configuración

**Request:**
```typescript
{
  unidadPeso: 'kg' | 'lbs'
}
```

**Validación:** Solo acepta 'kg' o 'lbs'

---

## Security & Rate Limiting

### Verificar Firma Webhook (Talo)

```typescript
import crypto from 'crypto'

export async function verifyTaloSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return hash === signature
}
```

### Rate Limiting (Futuro)

```typescript
// Usar middleware o vercel/ratelimit para limitar llamadas a Gemini
import { Ratelimit } from '@vercel/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),  // 10 requests por hora
})

const { success } = await ratelimit.limit(`user_${userId}`)
if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

---

## Environment Variables Necesarias

```bash
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# BD
MONGODB_URI=

# IA
GEMINI_API_KEY=

# Pagos
TALO_PUBLIC_KEY=
TALO_SECRET_KEY=
TALO_WEBHOOK_SECRET=
```

**NUNCA pushear estos valores.** Ver `.env.example` como template.

---

## Response Status Codes

| Code | Caso |
|------|------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (no session) |
| 403 | Forbidden (plan no permitido) |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

---

## Testing de Endpoints

```typescript
// __tests__/api/chat.test.ts
import { POST } from '@/app/api/chat/route'

test('POST /api/chat returns response', async () => {
  const req = new Request('http://localhost/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: '¿Estoy estancado?' })
  })

  const res = await POST(req)
  expect(res.status).toBe(200)

  const data = await res.json()
  expect(data).toHaveProperty('response')
})
```

---

## Resumen

1. **Siempre validar auth** (session)
2. **Validar plan** antes de features Pro
3. **Tipos TypeScript** en request/response
4. **Error handling** con try/catch
5. **Logging para debugging**
6. **Verificar firmas** de webhooks
7. **Rate limiting** en endpoints costosos

