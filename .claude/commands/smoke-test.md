# smoke-test

Smoke test automático post-implementación. Levanta el servidor de desarrollo, testea las rutas afectadas y reporta errores bloqueantes al agente principal.

## Argumentos

`$ARGUMENTS` — lista de rutas a testear separadas por espacio. Ejemplos:
- `/smoke-test /dashboard`
- `/smoke-test /api/routines /api/workouts /dashboard`
- `/smoke-test /login /registro` (rutas públicas)

Si no se pasan argumentos, testar `/` y `/dashboard` por defecto.

## Instrucciones

### 1. Preparar rutas a testear

Parsear `$ARGUMENTS` como lista de rutas. Si está vacío, usar `["/", "/dashboard"]`.

### 2. Verificar si el servidor ya está corriendo

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 2
```

- Si devuelve un código HTTP válido (cualquier número) → el servidor ya está corriendo, saltar al paso 4.
- Si falla (timeout/connection refused) → continuar al paso 3.

### 3. Levantar el servidor en background

```bash
npm run dev > /tmp/gymtrack-dev.log 2>&1 &
echo $! > /tmp/gymtrack-dev.pid
```

Luego esperar a que esté listo haciendo polling cada 2 segundos, máximo 30 segundos:

```bash
for i in $(seq 1 15); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 2)
  if [ -n "$STATUS" ] && [ "$STATUS" != "000" ]; then
    echo "Servidor listo (intento $i)"
    break
  fi
  echo "Esperando servidor... (intento $i/15)"
  sleep 2
done
```

Si después de 30 segundos no responde, mostrar el log y reportar error de build:

```bash
cat /tmp/gymtrack-dev.log
```

### 4. Testear cada ruta

Para cada ruta en la lista, ejecutar:

```bash
curl -s -o /tmp/gymtrack-response.html -w "%{http_code}" http://localhost:3000RUTA --max-time 10 -L
```

El flag `-L` sigue redirects (importante para rutas protegidas que redirigen a /login).

Evaluar el resultado:

| Código | Interpretación |
|--------|---------------|
| 200 | OK |
| 302/307/308 | OK — redirect esperado (ruta protegida o auth) |
| 404 | ADVERTENCIA — ruta no encontrada |
| 500 | ERROR BLOQUEANTE |
| 000 / timeout | ERROR — servidor no responde |

Adicionalmente, para respuestas 200, revisar el HTML buscando señales de error de Next.js:

```bash
grep -i "application error\|unhandled.*error\|internal server error" /tmp/gymtrack-response.html
```

Si encuentra alguno de esos strings → tratar como ERROR BLOQUEANTE aunque el HTTP code sea 200.

### 5. Apagar el servidor si fue levantado en este comando

Solo apagar si el PID en `/tmp/gymtrack-dev.pid` existe y fue creado en este paso:

```bash
if [ -f /tmp/gymtrack-dev.pid ]; then
  kill $(cat /tmp/gymtrack-dev.pid) 2>/dev/null
  rm /tmp/gymtrack-dev.pid
fi
```

### 6. Reportar resultados al agente principal

Emitir un resumen claro:

**Si todo OK:**
```
✓ Smoke test pasado — N rutas testeadas sin errores bloqueantes.
  GET /dashboard → 302 (redirect a login, esperado)
  GET /api/routines → 200 OK
```

**Si hay errores:**
```
✗ Smoke test FALLIDO — errores bloqueantes encontrados:

  ERROR: GET /api/routines → 500
  [pegar primeras 50 líneas del log o del HTML de error]

  El agente principal debe corregir estos errores antes de continuar.
```

Cuando hay errores, incluir suficiente contexto del log o respuesta HTTP para que el agente principal pueda diagnosticar y corregir sin tener que volver a correr el smoke test.
