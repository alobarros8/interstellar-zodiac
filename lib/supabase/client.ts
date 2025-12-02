/**
 * Cliente de Supabase para uso en el lado del cliente
 * Este cliente se utiliza en componentes de React y páginas del lado del cliente
 */

import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

/**
 * Crea y exporta una instancia del cliente de Supabase para el navegador
 * Lee las credenciales de las variables de entorno
 * 
 * @returns Cliente de Supabase configurado para operaciones del lado del cliente
 */
export const createClient = () => {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
