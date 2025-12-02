/**
 * Cliente de Supabase para uso en el lado del servidor
 * Este cliente se utiliza en Server Components, API Routes y Server Actions
 */

import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * Crea y exporta una instancia del cliente de Supabase para el servidor
 * Maneja automáticamente las cookies para mantener la sesión del usuario
 * 
 * @returns Cliente de Supabase configurado para operaciones del lado del servidor
 */
export const createClient = async () => {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                /**
                 * Obtiene una cookie específica
                 */
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                /**
                 * Establece una cookie con opciones de seguridad
                 */
                set(name: string, value: string, options) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // La función set() puede fallar en Server Components
                        // Esto está bien, las cookies se establecerán en el cliente
                    }
                },
                /**
                 * Elimina una cookie
                 */
                remove(name: string, options) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // La función remove() puede fallar en Server Components
                        // Esto está bien, las cookies se eliminarán en el cliente
                    }
                },
            },
        }
    )
}
