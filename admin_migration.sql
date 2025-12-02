-- Migración: Panel de Administración

-- 1. Agregar columna de rol a la tabla users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. Función segura para verificar si es admin (útil para policies)
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

-- 3. Actualizar Policies de Funciones (theatre_functions)

-- Permitir a admins INSERTAR funciones
CREATE POLICY "Admins can insert functions"
  ON public.theatre_functions
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Permitir a admins ACTUALIZAR funciones
CREATE POLICY "Admins can update functions"
  ON public.theatre_functions
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Permitir a admins ELIMINAR funciones
CREATE POLICY "Admins can delete functions"
  ON public.theatre_functions
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 4. Actualizar Policies de Compras (purchases)

-- Permitir a admins VER TODAS las compras
CREATE POLICY "Admins can view all purchases"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 5. Asignar rol de admin a tu usuario (REEMPLAZA EL EMAIL)
-- UPDATE public.users SET role = 'admin' WHERE email_user = 'tu@email.com';
