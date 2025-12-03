-- ============================================
-- CONFIGURACIÓN DE STORAGE PARA IMÁGENES
-- ============================================
-- Este script configura el bucket de Storage y sus políticas
-- Ejecutar en Supabase SQL Editor DESPUÉS de crear el bucket manualmente

-- IMPORTANTE: Antes de ejecutar este script, debes:
-- 1. Ir a Storage en Supabase Dashboard
-- 2. Crear un bucket llamado: Imagenes funciones
-- 3. Configurarlo como PÚBLICO
-- 4. Luego ejecutar este script

-- ============================================
-- POLÍTICAS DE STORAGE
-- ============================================

-- Permitir a TODOS ver/descargar imágenes (lectura pública)
CREATE POLICY "Public can view function images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'Imagenes funciones');

-- Permitir a ADMINS subir imágenes
CREATE POLICY "Admins can upload function images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'Imagenes funciones' 
  AND public.is_admin()
);

-- Permitir a ADMINS actualizar imágenes
CREATE POLICY "Admins can update function images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'Imagenes funciones' AND public.is_admin());

-- Permitir a ADMINS eliminar imágenes
CREATE POLICY "Admins can delete function images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'Imagenes funciones' AND public.is_admin());

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver políticas activas en storage
SELECT *
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects';
