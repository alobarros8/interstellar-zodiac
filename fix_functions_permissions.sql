-- Script para arreglar permisos de Funciones

-- 1. Habilitar seguridad en la tabla
ALTER TABLE public.theatre_functions ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas viejas para evitar conflictos
DROP POLICY IF EXISTS "Public can view functions" ON public.theatre_functions;
DROP POLICY IF EXISTS "Admins can insert functions" ON public.theatre_functions;
DROP POLICY IF EXISTS "Admins can update functions" ON public.theatre_functions;
DROP POLICY IF EXISTS "Admins can delete functions" ON public.theatre_functions;

-- 3. Crear política de LECTURA (Pública para todos)
CREATE POLICY "Public can view functions"
  ON public.theatre_functions
  FOR SELECT
  USING (true);

-- 4. Crear políticas de ESCRITURA (Solo Admins)

-- Insertar
CREATE POLICY "Admins can insert functions"
  ON public.theatre_functions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Actualizar
CREATE POLICY "Admins can update functions"
  ON public.theatre_functions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Eliminar
CREATE POLICY "Admins can delete functions"
  ON public.theatre_functions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
