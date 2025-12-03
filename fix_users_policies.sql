-- ============================================
-- FIX RÁPIDO: Políticas RLS para Tabla Users
-- ============================================
-- Ejecutar este script para permitir el registro de nuevos usuarios
-- (Solo si ya ejecutaste complete_admin_setup.sql anteriormente)

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas viejas
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Permitir a usuarios autenticados INSERTAR su propio registro (ESTO ES LO IMPORTANTE)
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

-- Verificar políticas creadas
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'users';
