# Guía de Instalación: Permisos Admin + Upload de Imágenes

## 🎯 Objetivo
Configurar los permisos de administración y habilitar el upload de imágenes a Supabase Storage para las funciones de teatro.

---

## 📋 Pasos a Seguir

### **Paso 1: Ejecutar Script de Permisos Admin**

1. Abre el **Supabase Dashboard** de tu proyecto
2. Ve a **SQL Editor** (en el menú lateral)
3. Abre el archivo [`complete_admin_setup.sql`](file:///c:/Users/Alejandro/.gemini/antigravity/playground/interstellar-zodiac/complete_admin_setup.sql)
4. Copia todo el contenido del archivo
5. Pégalo en el SQL Editor de Supabase
6. Haz clic en **"Run"**
7. ✅ Verifica que no haya errores

> Este script:
> - Agrega la columna `role` a la tabla `users`
> - Crea la función `is_admin()` para verificar permisos
> - Configura las políticas RLS en `theatre_functions`
> - **Te asigna el rol de admin** (usando tu email: alobarros8@gmail.com)

---

### **Paso 2: Crear Bucket de Storage**

1. En el Supabase Dashboard, ve a **Storage** (menú lateral)
2. Haz clic en **"New bucket"**
3. Configura el bucket:
   - **Name**: `function-images`
   - **Public bucket**: ✅ Activar (para que las imágenes se puedan ver públicamente)
4. Haz clic en **"Create bucket"**

![Ejemplo de creación de bucket](https://supabase.com/_next/image?url=%2Fdocs%2Fimg%2Fstorage%2Fcreate-bucket.png&w=3840&q=75)

---

### **Paso 3: Configurar Políticas de Storage**

1. Aún en **SQL Editor**, abre el archivo [`storage_setup.sql`](file:///c:/Users/Alejandro/.gemini/antigravity/playground/interstellar-zodiac/storage_setup.sql)
2. Copia todo el contenido
3. Pégalo en el SQL Editor
4. Haz clic en **"Run"**
5. ✅ Verifica que no haya errores

> Este script configura las políticas para que:
> - Todos puedan **ver** las imágenes (lectura pública)
> - Solo **admins** puedan **subir, actualizar y eliminar** imágenes

---

### **Paso 4: Verificar Configuración**

#### 4.1 Verificar tu rol de admin

Ejecuta esta consulta en SQL Editor:

```sql
SELECT id, email_user, role, user_id 
FROM public.users 
WHERE email_user = 'alobarros8@gmail.com';
```

**Resultado esperado:**
- Deberías ver tu usuario con `role = 'admin'`

#### 4.2 Verificar políticas de funciones

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'theatre_functions';
```

**Resultado esperado:**
- Deberías ver 4 políticas: SELECT (Public), INSERT (Admins), UPDATE (Admins), DELETE (Admins)

---

### **Paso 5: Probar la Funcionalidad**

1. **En tu aplicación**, ve a: `http://localhost:3000/admin/funciones` (o tu URL de desarrollo)

2. Haz clic en **"+ Nueva Función"**

3. Completa el formulario:
   - **Nombre de la obra**: Ejemplo "Romeo y Julieta"
   - **Descripción**: Breve descripción
   - **Precio**: 15000
   - **Imagen**: Haz clic en el selector de archivo y elige una imagen (JPG, PNG o WebP, máximo 5MB)

4. Deberías ver un **preview de la imagen** antes de guardar

5. Haz clic en **"Guardar Función"**
   - El botón mostrará "Subiendo imagen..." durante el proceso
   - Si todo está bien, verás el mensaje "Función creada correctamente"

6. **Verifica en Supabase**:
   - Ve a **Storage** > **function-images**
   - Deberías ver tu imagen subida
   - Ve a **Table Editor** > **theatre_functions**
   - Deberías ver tu nueva función con la URL de la imagen en `imagen_funcion`

7. **Verifica en la aplicación**:
   - La función debería aparecer en la lista de funciones del admin
   - La imagen debería mostrarse correctamente

---

## 🐛 Solución de Problemas

### Error: "new row violates row-level security policy"

**Causa**: El rol de admin no se asignó correctamente.

**Solución**: Ejecuta manualmente en SQL Editor:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email_user = 'alobarros8@gmail.com';
```

---

### Error: "storage/object-not-found" o "bucket not found"

**Causa**: El bucket `function-images` no existe o no está configurado como público.

**Solución**:
1. Ve a Storage en Supabase
2. Verifica que exista el bucket `function-images`
3. Haz clic en los 3 puntos > **"Edit bucket"**
4. Asegúrate que **"Public bucket"** esté activado

---

### Error: "Failed to upload image"

**Causa**: Las políticas de Storage no están configuradas.

**Solución**: Ejecuta nuevamente el script `storage_setup.sql`

---

### La imagen no se muestra en la lista o en el sitio público

**Causa**: El bucket no es público.

**Solución**:
1. Ve a Storage > function-images
2. Edita el bucket y activa **"Public bucket"**

---

## ✅ Validación Final

Si todo funciona correctamente:

- ✅ Puedes crear funciones desde el admin
- ✅ Puedes subir imágenes (aparece el preview)
- ✅ Las imágenes se guardan en Storage
- ✅ Las funciones aparecen en la lista del admin con su imagen
- ✅ Las funciones son visibles en el sitio público (`/funciones`)

---

## 📁 Archivos Creados

- [`complete_admin_setup.sql`](file:///c:/Users/Alejandro/.gemini/antigravity/playground/interstellar-zodiac/complete_admin_setup.sql) - Script de permisos
- [`storage_setup.sql`](file:///c:/Users/Alejandro/.gemini/antigravity/playground/interstellar-zodiac/storage_setup.sql) - Script de Storage
- [`lib/upload-helpers.ts`](file:///c:/Users/Alejandro/.gemini/antigravity/playground/interstellar-zodiac/lib/upload-helpers.ts) - Funciones helper
- [`app/admin/funciones/page.tsx`](file:///c:/Users/Alejandro/.gemini/antigravity/playground/interstellar-zodiac/app/admin/funciones/page.tsx) - Formulario modificado

---

## 🎉 ¡Listo!

Ahora puedes agregar funciones con imágenes desde el panel de administración.
