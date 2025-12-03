-- ============================================
-- CONFIGURACIÓN COMPLETA DE ADMINISTRACIÓN
-- ============================================
-- Este script configura todos los permisos necesarios para el panel de admin
-- Ejecutar en Supabase SQL Editor
-- Usuario: alobarros8@gmail.com

-- ============================================
-- 1. PREPARAR TABLA USERS
-- ============================================

-- Agregar columna de rol si no existe
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Agregar columna user_id si no existe (para relacionar con auth.users)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Crear índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS users_user_id_idx ON public.users(user_id);
CREATE INDEX IF NOT EXISTS users_role_idx ON public.users(role);

-- ============================================
-- 2. CREAR FUNCIÓN HELPER PARA VERIFICAR ADMIN
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. CONFIGURAR RLS EN THEATRE_FUNCTIONS
-- ============================================

-- Habilitar RLS
ALTER TABLE public.theatre_functions ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas viejas
DROP POLICY IF EXISTS "Public can view functions" ON public.theatre_functions;
DROP POLICY IF EXISTS "Admins can insert functions" ON public.theatre_functions;
DROP POLICY IF EXISTS "Admins can update functions" ON public.theatre_functions;
DROP POLICY IF EXISTS "Admins can delete functions" ON public.theatre_functions;

-- LECTURA: Todos pueden ver las funciones (público)
CREATE POLICY "Public can view functions"
  ON public.theatre_functions
  FOR SELECT
  USING (true);

-- INSERTAR: Solo admins pueden crear funciones
CREATE POLICY "Admins can insert functions"
  ON public.theatre_functions
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ACTUALIZAR: Solo admins pueden editar funciones
CREATE POLICY "Admins can update functions"
  ON public.theatre_functions
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ELIMINAR: Solo admins pueden borrar funciones
CREATE POLICY "Admins can delete functions"
  ON public.theatre_functions
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- 4. CONFIGURAR RLS EN PURCHASES (para admin panel)
-- ============================================

-- Permitir a admins VER TODAS las compras
DROP POLICY IF EXISTS "Admins can view all purchases" ON public.purchases;
CREATE POLICY "Admins can view all purchases"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- 5. CONFIGURAR RLS EN TABLA USERS
-- ============================================

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas viejas
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Permitir a usuarios autenticados INSERTAR su propio registro (para registro)
CREATE POLICY "Users can insert own data"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Permitir a usuarios VER su propio registro
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Permitir a usuarios ACTUALIZAR su propio registro
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Permitir a ADMINS ver todos los usuarios
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- 6. ASIGNAR ROL DE ADMIN AL USUARIO
-- ============================================

-- Actualizar el usuario específico
UPDATE public.users 
SET role = 'admin' 
WHERE email_user = 'alobarros8@gmail.com';

-- ============================================
-- 7. VERIFICACIÓN
-- ============================================

-- Ver usuarios con rol admin
SELECT id, email_user, role, user_id 
FROM public.users 
WHERE role = 'admin';

-- Verificar políticas activas en theatre_functions
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'theatre_functions';
