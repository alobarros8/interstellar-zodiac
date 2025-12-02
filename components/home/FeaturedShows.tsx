/**
 * Componente FeaturedShows
 * Muestra las funciones destacadas en la página de inicio
 * Obtiene las primeras 3 funciones de la base de datos
 */

import { createClient } from '@/lib/supabase/server'
import ShowCard from '@/components/shows/ShowCard'
import styles from './FeaturedShows.module.css'

/**
 * Componente de funciones destacadas - Server Component
 */
export default async function FeaturedShows() {
    const supabase = await createClient()

    /**
     * Obtiene las primeras 3 funciones de la base de datos
     */
    const { data: shows, error } = await supabase
        .from('theatre_functions')
        .select('*')
        .limit(3)

    if (error) {
        console.error('Error fetching featured shows:', error)
        return (
            <div className={styles.emptyState}>
                <p>No se pudieron cargar las funciones destacadas</p>
            </div>
        )
    }

    if (!shows || shows.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>Pronto habrá nuevas funciones disponibles</p>
            </div>
        )
    }

    return (
        <div className={styles.grid}>
            {shows.map((show) => (
                <ShowCard key={show.id} show={show} />
            ))}
        </div>
    )
}
