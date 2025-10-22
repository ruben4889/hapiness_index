# 🚀 Social Media & Happiness Dashboard

Dashboard completo listo para desplegar en Vercel con conexión a PostgreSQL.

## 📋 Estructura del Proyecto

```
proyecto/
├── api/
│   └── dashboard-data.js     # Serverless function para Vercel
├── src/
│   ├── components/
│   │   └── Dashboard.jsx     # Componente principal
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── vercel.json              # Configuración de Vercel
└── .env.example
```

## 🛠️ Instalación Local

### 1. Clonar o descargar el proyecto

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL:
```env
DB_HOST=localhost
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_PORT=5432
DB_SSL=false
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

Abre http://localhost:3000

## 🌐 Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

#### 1. Sube tu proyecto a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

#### 2. Conecta con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite

#### 3. Configura las Variables de Entorno en Vercel
En el dashboard de Vercel, ve a:
- **Settings** → **Environment Variables**

Añade estas variables:
```
DB_HOST = tu_servidor_postgresql
DB_NAME = tu_base_de_datos
DB_USER = tu_usuario
DB_PASSWORD = tu_contraseña
DB_PORT = 5432
DB_SSL = true
```

⚠️ **IMPORTANTE**: Si tu PostgreSQL está en tu computadora local, NO funcionará en Vercel. Necesitas una base de datos accesible por internet.

#### 4. Despliega
Haz clic en **Deploy** y espera unos minutos.

### Opción 2: Desde CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Configura las variables de entorno cuando te lo pida
```

## 🗄️ Opciones de Base de Datos para Producción

Si tu PostgreSQL está en local, necesitas usar una BD en la nube:

### 1. **Supabase** (Gratis, Recomendado)
- Ve a [supabase.com](https://supabase.com)
- Crea un proyecto
- Obtén las credenciales de conexión
- Usa esas credenciales en Vercel

### 2. **Neon** (Gratis)
- Ve a [neon.tech](https://neon.tech)
- Crea una base de datos serverless
- Obtén la connection string

### 3. **Railway** (Gratis para empezar)
- Ve a [railway.app](https://railway.app)
- Crea una base de datos PostgreSQL

### 4. **Heroku Postgres** (De pago)

### 5. **AWS RDS** (De pago)

## 📊 Migrar tus Datos

Si tienes datos locales, expórtalos e impórtalos a tu nueva BD:

```bash
# Exportar desde local
pg_dump -U tu_usuario tu_base_datos > backup.sql

# Importar a la nueva BD (ejemplo con Supabase)
psql -h db.xxxx.supabase.co -U postgres -d postgres < backup.sql
```

## ✅ Verificar el Despliegue

Una vez desplegado en Vercel:

1. Vercel te dará una URL como: `https://tu-proyecto.vercel.app`
2. Verifica que la API funciona: `https://tu-proyecto.vercel.app/api/dashboard-data`
3. Abre el dashboard y verifica que carga los datos

## 🐛 Troubleshooting

### Error: "Unable to connect to database"
- Verifica que las variables de entorno estén correctas en Vercel
- Verifica que tu BD en la nube sea accesible públicamente
- Si usas SSL, asegúrate de que `DB_SSL=true`

### Error: "Module not found"
- Ejecuta `npm install` localmente
- Asegúrate de que `package.json` tiene todas las dependencias
- Redespliega en Vercel

### El dashboard carga pero no muestra datos
- Abre la consola del navegador (F12)
- Verifica que la petición a `/api/dashboard-data` sea exitosa
- Verifica que tu tabla `users` exista en la BD de producción

### Error de CORS
- Ya está configurado en `api/dashboard-data.js`
- Si persiste, verifica la configuración de tu BD en la nube

## 🔒 Seguridad

⚠️ **NUNCA** subas tus credenciales a GitHub:
- Usa variables de entorno
- El archivo `.env` está en `.gitignore`
- Configura las variables en el dashboard de Vercel

## 📝 Scripts Disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Build para producción
npm run preview  # Preview del build
```

## 🎨 Personalización

- Edita `src/components/Dashboard.jsx` para cambiar el diseño
- Modifica `tailwind.config.js` para cambiar colores
- Actualiza `api/dashboard-data.js` para cambiar las queries

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel: **Deployments** → **Tu deployment** → **Function Logs**
2. Verifica las variables de entorno
3. Asegúrate de que tu BD esté accesible desde internet

---

¡Tu dashboard estará en línea en minutos! 🎉
