# Sistema de Administración - Configuración

## ✅ Sistema Implementado

Se ha implementado un sistema completo de administración que permite:

1. **Control de sesiones por correo** - Solo una sesión activa por usuario
2. **Panel de administración** - Gestionar usuarios autorizados dinámicamente
3. **Roles de usuario** - Administradores y usuarios autorizados
4. **Lista dinámica de usuarios** - Los admins pueden agregar/eliminar usuarios sin modificar código

---

## 📋 Configuración en Firebase Console

### 1. Habilitar Realtime Database

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto **sgsst-c988a**
3. En el menú lateral, busca **Realtime Database**
4. Haz clic en **"Crear base de datos"**
5. Selecciona la ubicación (ej: us-central1)
6. Selecciona **"Comenzar en modo bloqueado"**
7. Haz clic en **"Habilitar"**

### 2. Configurar Reglas de Seguridad

1. En Realtime Database, ve a la pestaña **"Reglas"** (Rules)
2. Copia y pega el contenido del archivo `firebase-database-rules.json`:

```json
{
  "rules": {
    "active-sessions": {
      "$emailKey": {
        ".read": "auth != null",
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['sessionId', 'loginTime', 'email'])"
      }
    },
    "authorized-emails": {
      "$emailKey": {
        ".read": "auth != null",
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['email', 'addedAt', 'addedBy'])"
      }
    }
  }
}
```

3. Haz clic en **"Publicar"**

### 3. Verificar URL de la Base de Datos

Verifica que la URL en `environments.ts` y `environments.prod.ts` sea correcta:
```typescript
databaseURL: "https://sgsst-c988a-default-rtdb.firebaseio.com"
```

---

## 👥 Administradores

Los administradores están definidos en `environments.ts`:

```typescript
authorizedAdmins: [
    'camiloflstudio@gmail.com',
    'orangesst1@gmail.com'
]
```

### Para agregar un nuevo administrador:

1. Edita `src/environments/environments.ts`
2. Edita `src/environments/environments.prod.ts`
3. Agrega el correo a la lista `authorizedAdmins`
4. Compila y despliega: `npm run build && firebase deploy`

---

## 🔐 Características del Sistema

### Control de Sesiones
- ✅ Solo una sesión activa por correo electrónico
- ✅ Mensaje de error si intenta iniciar sesión con sesión activa
- ✅ Limpieza automática al cerrar sesión o cerrar navegador

### Panel de Administración
- ✅ Accesible solo para administradores
- ✅ Ruta protegida: `/admin`
- ✅ Link visible solo para administradores en el navbar
- ✅ Agregar usuarios autorizados con un clic
- ✅ Eliminar usuarios autorizados (excepto administradores)
- ✅ Lista en tiempo real de usuarios autorizados

### Sistema de Autorización
- ✅ Lista dinámica almacenada en Firebase Realtime Database
- ✅ No requiere recompilar para agregar/quitar usuarios
- ✅ Perfecto para demos y pruebas rápidas

---

## 🚀 Despliegue

```bash
# Compilar para producción
npm run build

# Desplegar en Firebase Hosting
firebase deploy
```

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `src/app/services/admin.service.ts` - Servicio de administración
- `src/app/services/session.service.ts` - Servicio de sesiones
- `src/app/guards/admin.guard.ts` - Guard para rutas de admin
- `src/app/components/pages/admin/` - Componente de administración
- `firebase-database-rules.json` - Reglas de Firebase

### Archivos Modificados:
- `src/environments/environments.ts` - Lista de administradores
- `src/environments/environments.prod.ts` - Lista de administradores
- `src/app/app.module.ts` - Imports y declaraciones
- `src/app/app-routing.module.ts` - Ruta de admin
- `src/app/guards/auth.guard.ts` - Verificación dinámica
- `src/app/components/shared/login/login.component.ts` - Control de sesiones
- `src/app/components/shared/navBar/` - Link de admin
- `src/app/app.component.ts` - Limpieza de sesiones

---

## 🎯 Cómo Usar

### Para Administradores:

1. Inicia sesión con tu cuenta de administrador
2. En el navbar, haz clic en el botón "⚙️ Admin"
3. En el panel de administración:
   - **Agregar usuario**: Escribe el correo y haz clic en "Agregar"
   - **Eliminar usuario**: Haz clic en "Eliminar" junto al usuario
   - Los administradores aparecen con badge "ADMIN" y no pueden eliminarse

### Para Usuarios Autorizados:

1. Los usuarios autorizados pueden iniciar sesión normalmente
2. Solo pueden tener una sesión activa a la vez
3. No tienen acceso al panel de administración

---

## ⚠️ Notas Importantes

- Los administradores también deben estar en la lista `authorizedEmails`
- Los administradores NO pueden ser eliminados desde el panel
- La lista inicial de usuarios se carga automáticamente al inicializar el servicio
- Las sesiones se limpian automáticamente al cerrar el navegador o hacer logout

---

## 🔧 Troubleshooting

### "No tiene permitido iniciar sesión en este momento"
- Ya tienes una sesión activa en otro navegador/dispositivo
- Cierra todas las sesiones y vuelve a intentar

### "Usuario/correo no autorizado"
- Tu correo no está en la lista de usuarios autorizados
- Contacta a un administrador para que te agregue

### No aparece el link de "Admin" en el navbar
- Tu cuenta no está en la lista de administradores
- Verifica que tu correo esté en `environment.authorizedAdmins`
