# GymTrack

Aplicación web multi-usuario para gestionar rutinas de gimnasio. Registra entrenamientos, visualiza progreso detallado y obtén insights sobre tu desempeño con gráficos interactivos y análisis avanzado.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Estilos**: Tailwind CSS v4
- **Base de datos**: MongoDB Atlas (con Mongoose)
- **Autenticación**: NextAuth.js v5 (Google OAuth)
- **Deploy**: Vercel
- **IA**: Google Gemini 2.5 Flash Lite (clasificación muscular e importación)
- **Gráficos**: Nivo (line, bar, calendar, radar)
- **Drag & Drop**: @dnd-kit
- **Íconos**: lucide-react

---

## 📋 Requisitos previos

- **Node.js** ≥ 18
- **npm** o **yarn**
- **MongoDB Atlas** (plan M0 gratuito)
- **Google OAuth** (credenciales de Google Cloud)
- **Gemini API key** (Google AI Studio)

---

## 🔧 Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd gymtrack
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/gymtrack?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_SECRET=<random-secret-string>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Gemini API
GEMINI_API_KEY=<your-gemini-api-key>
```

#### 📝 Cómo obtener cada variable:

**MONGODB_URI**
1. Ir a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster (plan M0 es gratuito)
3. Generar usuario con contraseña
4. Copiar connection string y reemplazar `<user>`, `<password>`, `<cluster>`

**NEXTAUTH_SECRET** (para desarrollo)
```bash
openssl rand -base64 32
```

**NEXTAUTH_URL**
- Desarrollo: `http://localhost:3000`
- Producción: `https://tu-dominio.com`

**GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET**
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear nuevo proyecto
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0 (tipo "Aplicación web")
5. Agregar URIs autorizados:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tu-dominio.com/api/auth/callback/google` (producción)

**GEMINI_API_KEY**
1. Ir a [Google AI Studio](https://aistudio.google.com)
2. Crear nueva clave de API
3. Copiar y pegar en `.env.local`

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Build para producción

```bash
npm run build
npm start
```

---

## ✨ Funcionalidades Existentes

### 📅 Gestión de Rutinas
- **Crear y editar rutinas** personalizadas con cualquier estructura de split (PPL, Upper/Lower, Full Body, etc.)
- **Organizar sesiones** (Lunes, Martes, etc.) con ejercicios asignados
- **Definir series y reps** (rango flexible: ej: 8-10 reps, o fijo: 10 reps)
- **Notas técnicas** por ejercicio para recordar detalles de ejecución
- **Links a imágenes** de Google Images con el nombre del ejercicio para consultar técnica

### 📊 Registro de Entrenamientos
- **Log diario** de entrenamientos: peso usado, reps completadas, series hechas
- **Intensidad percibida** (RPE 1-10) al finalizar cada entrenamiento
- **Historial completo** con visualización detallada de cada sesión
- **Edición de logs** para corregir datos

### 📈 Estadísticas y Análisis

**Sección Free:**
- **Progreso de peso**: gráfico temporal por ejercicio, últimas N sesiones
- **Volumen semanal**: barras de volumen total (peso × reps × series) últimas 5 semanas
- **Intensidad (RPE)**: línea de esfuerzo percibido a lo largo del tiempo
- **Consistencia**: heatmap anual de entrenamientos realizados
- **Frecuencia de sesiones**: barras horizontales de entrenamientos por tipo

**Sección Análisis Avanzado:**
- **Balance de volumen**: distribución de volumen por tipo de sesión (Push/Pull/Legs)
- **1RM estimado**: cálculo del máximo teórico por ejercicio (fórmula Epley)
- **Detección de plateau**: identifica ejercicios sin progreso en últimas 4 sesiones
- **Distribución muscular**: radar polar mostrando volumen por grupo muscular (Pecho, Espalda, Hombros, Bíceps, Tríceps, Cuádriceps, Isquiotibiales, Glúteos, Abdominales, Pantorrillas)

### ⚙️ Configuración de Usuario
- **Unidad de peso**: elige entre kg o lbs (los pesos siempre se almacenan en kg, conversión en presentación)
- **Persistencia de preferencias**: se guarda en el perfil del usuario

### 📥 Importar desde Excel
- **Subir archivo .xlsx** con rutina preexistente e historial de entrenamientos
- **Conversación con Gemini**: la IA interpreta el contenido (hasta 3 rondas de preguntas para aclarar fechas, unidades, etc.)
- **Review antes de guardar**: confirma rutinas y logs antes de persistir en base de datos
- **Historial importado**: los logs se cargan con fechas estimadas si es necesario

---

## 🎯 Ideas para el Futuro

### Suscripción Premium
- **Entrenamientos ilimitados** (versión free: límite bajo de registros)
- **Planes de entrenamiento** generados por IA
- **Análisis predictivo**: predicción de 1RM futuro, sugerencias de incremento de peso
- **Alertas personalizadas**: recordatorios de plateaus, volumen bajo, etc.
- **Exportar datos**: descarga de reportes en PDF, Excel
- **Sincronización con wearables**: integración con Apple Health, Google Fit

### Funcionalidades Sociales
- **Compartir rutinas**: permite a otros usuarios copiar y adaptar tus rutinas
- **Leaderboards**: ranking global de volumen acumulado, frecuencia, etc.
- **Comunidad**: feed de logros, desafíos grupales
- **Compañero de entrenamiento**: seguir progresos de amigos

### Inteligencia Artificial
- **Coach IA**: recomendaciones personalizadas de incremento de peso, cambio de ejercicios
- **Análisis de técnica**: sugerencias basadas en tus métricas (RPE alto, plateau prolongado)
- **Plan inteligente**: generar rutinas optimizadas basadas en tus objetivos y disponibilidad

### Gamificación
- **Badges y logros**: alcanzar ciertos hitos (volumen acumulado, racha de semanas, PR)
- **Rachas**: tracking visual de días/semanas de entrenamiento consistente
- **Desafíos semanales**: objetivos automáticos generados (ej: 20k kg de volumen en la semana)
- **Sistema de puntos**: ganar puntos por entrenamientos y convertirlos en rewards

### Integraciones Externas
- **Spotify**: reproducir playlists mientras entrenas
- **Calendario**: sincronizar entrenamientos con Google Calendar / Outlook
- **Notificaciones push**: recordatorios de entrenamientos agendados
- **Dark mode inteligente**: ajuste automático según hora del día

### Mobile App Nativa
- **iOS / Android**: app nativa con sincronización en tiempo real
- **Offline mode**: registrar entrenamientos sin conexión, sincronizar después
- **Cámara**: capturar fotos de progreso físico

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (app)/              ← Rutas protegidas (con AppShell)
│   │   ├── dashboard/
│   │   ├── entrenar/
│   │   ├── rutina/
│   │   ├── estadisticas/
│   │   ├── historial/
│   │   ├── importar/
│   │   └── configuracion/
│   ├── (auth)/             ← Rutas públicas (auth)
│   │   ├── login/
│   │   └── registro/
│   ├── api/                ← API routes
│   │   ├── auth/
│   │   ├── routine/
│   │   ├── workout-log/
│   │   ├── import/
│   │   └── ...
│   ├── layout.tsx
│   └── page.tsx
├── models/                 ← Esquemas de MongoDB
├── lib/                    ← Utilidades y helpers
├── components/
│   ├── ui/                 ← Componentes reutilizables
│   └── [feature]/          ← Componentes específicos
├── auth.ts                 ← Configuración NextAuth
├── auth.config.ts          ← Config edge-compatible
└── proxy.ts                ← Middleware (Next.js 16)
```

---

## 🧪 Testing

(Por implementar) - Se planea agregar tests E2E con Playwright y unitarios con Vitest.

---

## 📚 Documentación Adicional

- **Modelos de datos**: Ver `src/models/CLAUDE.md`
- **Instrucciones de desarrollo**: Ver `.claude/CLAUDE.md`
- **Backlog y roadmap**: Ver `.claude/BACKLOG.md`

---

## 🤝 Contribuir

Las tareas se gestionan en `.claude/BACKLOG.md`. Antes de implementar cualquier funcionalidad:

1. Leer el backlog
2. Mover la tarea a "En progreso"
3. Implementar
4. Eliminar la tarea del backlog (sin marcar, simplemente borrar)

---

## 📄 Licencia

MIT

---

## 🆘 Soporte

Para reportar bugs o sugerir features, abre un issue en el repositorio.

---

**¡Gracias por usar GymTrack!** 💪
