# 🚀 GUÍA RÁPIDA - Desplegar en Vercel en 5 Pasos

## ⚠️ IMPORTANTE PRIMERO

Tu base de datos PostgreSQL debe ser accesible desde internet. Si está en tu computadora local, **NO funcionará en Vercel**.

**Opciones de BD gratuita:**
- **Supabase** → https://supabase.com (Recomendado)
- **Neon** → https://neon.tech
- **Railway** → https://railway.app

---

## 📋 Paso 1: Preparar Base de Datos en la Nube

### Opción A: Supabase (Más Fácil)

1. Ve a https://supabase.com
2. Crea una cuenta y un nuevo proyecto
3. Ve a **Database** → **Connection string**
4. Copia las credenciales:
   - Host: `db.xxxxx.supabase.co`
   - Database: `postgres`
   - User: `postgres`
   - Password: [tu contraseña]
   - Port: `5432`

5. Crea tu tabla `users` en Supabase:
   - Ve a **SQL Editor**
   - Pega tu script SQL
   - Ejecuta

### Opción B: Neon

1. Ve a https://neon.tech
2. Crea un proyecto
3. Obtén la connection string
4. Crea tu tabla con el SQL editor

---

## 📋 Paso 2: Subir Proyecto a GitHub

```bash
# Inicializa git (si no lo has hecho)
git init

# Añade todos los archivos
git add .

# Haz commit
git commit -m "Dashboard inicial"

# Conecta con GitHub
# (Primero crea un repositorio en github.com)
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git

# Sube el código
git branch -M main
git push -u origin main
```

---

## 📋 Paso 3: Conectar con Vercel

1. Ve a https://vercel.com
2. Haz login (puedes usar tu cuenta de GitHub)
3. Haz clic en **"New Project"**
4. **Import** tu repositorio de GitHub
5. Vercel detectará automáticamente que es un proyecto Vite

---

## 📋 Paso 4: Configurar Variables de Entorno

**ANTES de hacer deploy**, configura las variables:

En Vercel:
1. Ve a **Settings** → **Environment Variables**
2. Añade estas variables (con los datos de tu BD en la nube):

```
DB_HOST       →  db.xxxxx.supabase.co
DB_NAME       →  postgres
DB_USER       →  postgres
DB_PASSWORD   →  tu_contraseña_supabase
DB_PORT       →  5432
DB_SSL        →  true
```

⚠️ **Importante**: Añade las variables en los 3 ambientes:
- Production
- Preview
- Development

---

## 📋 Paso 5: Desplegar

1. Haz clic en **Deploy**
2. Espera 2-3 minutos
3. Vercel te dará una URL: `https://tu-proyecto.vercel.app`
4. ¡Visita tu dashboard!

---

## ✅ Verificar que Funciona

1. Abre: `https://tu-proyecto.vercel.app`
2. Deberías ver tu dashboard cargando
3. Verifica la API: `https://tu-proyecto.vercel.app/api/dashboard-data`

---

## 🐛 Si algo sale mal...

### El dashboard no carga datos

**Verifica en Vercel:**
1. Ve a **Deployments** → tu deployment → **Function Logs**
2. Busca errores de conexión a la BD

**Soluciones comunes:**
- Verifica que las variables de entorno estén bien escritas
- Verifica que `DB_SSL=true` si usas Supabase/Neon
- Verifica que tu BD en la nube esté activa
- Verifica que la tabla `users` exista

### Error: "Unable to connect"

Tu BD probablemente no es accesible:
- ✅ Usa Supabase, Neon o Railway
- ❌ NO uses una BD en localhost

### Error de CORS

Ya está configurado, pero si persiste:
- Verifica que la API esté en `/api/dashboard-data.js`
- Redespliega en Vercel

---

## 🔄 Actualizar el Proyecto

Después del primer despliegue, solo necesitas:

```bash
git add .
git commit -m "Actualización"
git push
```

Vercel detectará el cambio y redesplegará automáticamente.

---

## 💡 Tips

- Vercel te da deploys ilimitados gratis
- Cada push a `main` genera un nuevo deploy automático
- Puedes tener múltiples ambientes (producción, staging, etc.)
- Los logs están en tiempo real en el dashboard de Vercel

---

## 📊 Ejemplo con Supabase (Paso a Paso)

### 1. Crea el proyecto en Supabase
- Nombre: `social-media-dashboard`
- Región: Elige la más cercana
- Database Password: Guarda esta contraseña

### 2. Crea la tabla
```sql
-- En SQL Editor de Supabase, pega esto:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    age INTEGER,
    gender VARCHAR(20),
    primary_platform VARCHAR(50),
    screen_time_hours DECIMAL(4,2),
    happiness_score DECIMAL(3,2),
    stress_level DECIMAL(3,2),
    sleep_quality DECIMAL(3,2),
    exercise_frequency DECIMAL(3,2)
);

-- Inserta datos de prueba
INSERT INTO users (age, gender, primary_platform, screen_time_hours, happiness_score, stress_level, sleep_quality, exercise_frequency) 
VALUES 
(25, 'Male', 'LinkedIn', 4.5, 8.5, 6.2, 7.0, 3.0),
(30, 'Female', 'Instagram', 6.5, 7.2, 7.5, 5.5, 2.0);
```

### 3. Obtén las credenciales
- Ve a **Settings** → **Database**
- Copia el **Host** (db.xxxxx.supabase.co)
- Usa: User=`postgres`, Database=`postgres`

### 4. Pégalas en Vercel
Como se explicó en el Paso 4

---

¡Listo! Tu dashboard estará en línea en ~5 minutos 🎉
