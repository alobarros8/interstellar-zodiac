-- ============================================
-- FUNCIÓN RPC PARA INCREMENTAR ENTRADAS VENDIDAS
-- ============================================
-- Esta función se llama desde el frontend cuando se realiza una compra

CREATE OR REPLACE FUNCTION public.increment_entradas_vendidas(
    p_function_id bigint,
    p_quantity integer
)
RETURNS void AS $$
BEGIN
    UPDATE public.theatre_functions
    SET entradas_vendidas = entradas_vendidas + p_quantity
    WHERE id = p_function_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos para que usuarios autenticados puedan ejecutarla
GRANT EXECUTE ON FUNCTION public.increment_entradas_vendidas(bigint, integer) TO authenticated;

-- ============================================
-- VERIFICAR LA FUNCIÓN
-- ============================================

-- Ver la función creada
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'increment_entradas_vendidas';
