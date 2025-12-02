/**
 * Página de Funciones
 * Lista todas las funciones de teatro con opciones de ordenamiento
 * Soporta búsqueda mediante query parameter
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TheatreFunction } from '@/types/database.types'
import ShowCard from '@/components/shows/ShowCard'
import { useSearchParams } from 'next/navigation'
import styles from './funciones.module.css'

/**
 * Tipo para las opciones de ordenamiento
 */
type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

/**
 * Página de listado de funciones
 */
export default function ShowsPage() {
    const [shows, setShows] = useState<TheatreFunction[]>([])
    const [filteredShows, setFilteredShows] = useState<TheatreFunction[]>([])
    const [sortBy, setSortBy] = useState<SortOption>('name-asc')
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const searchTerm = searchParams.get('search')

    const supabase = createClient()

    /**
     * Carga las funciones desde Supabase
     */
    useEffect(() => {
        async function loadShows() {
            setLoading(true)
            const { data, error } = await supabase
                .from('theatre_functions')
                .select('*')

            if (error) {
                console.error('Error fetching shows:', error)
            } else {
                setShows(data || [])
                setFilteredShows(data || [])
            }
            setLoading(false)
        }

        loadShows()
    }, [supabase])

    /**
     * Filtra las funciones por término de búsqueda
     */
    useEffect(() => {
        if (searchTerm && shows.length > 0) {
            const filtered = shows.filter((show) =>
                show.nombre_funcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (show.descripcion_funcion?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
            )
            setFilteredShows(filtered)
        } else {
            setFilteredShows(shows)
        }
    }, [searchTerm, shows])

    /**
     * Ordena las funciones según la opción seleccionada
     */
    const sortedShows = [...filteredShows].sort((a, b) => {
        switch (sortBy) {
            case 'name-asc':
                return a.nombre_funcion.localeCompare(b.nombre_funcion)
            case 'name-desc':
                return b.nombre_funcion.localeCompare(a.nombre_funcion)
            case 'price-asc':
                return (a.valor_entrada_funcion || 0) - (b.valor_entrada_funcion || 0)
            case 'price-desc':
                return (b.valor_entrada_funcion || 0) - (a.valor_entrada_funcion || 0)
            default:
                return 0
        }
    })

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Todas las Funciones</h1>
                    {searchTerm && (
                        <p className={styles.searchInfo}>
                            Resultados para: <span className={styles.searchTerm}>"{searchTerm}"</span>
                        </p>
                    )}
                </div>

                {/* Controles de ordenamiento */}
                <div className={styles.controls}>
                    <label htmlFor="sort" className={styles.sortLabel}>
                        Ordernar por:
                    </label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className={styles.sortSelect}
                    >
                        <option value="name-asc">Nombre (A-Z)</option>
                        <option value="name-desc">Nombre (Z-A)</option>
                        <option value="price-asc">Precio (Menor a Mayor)</option>
                        <option value="price-desc">Precio (Mayor a Menor)</option>
                    </select>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Cargando funciones...</p>
                    </div>
                )}

                {/* Listado de funciones */}
                {!loading && sortedShows.length > 0 && (
                    <div className={styles.grid}>
                        {sortedShows.map((show) => (
                            <ShowCard key={show.id} show={show} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && sortedShows.length === 0 && (
                    <div className={styles.emptyState}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <h2>No se encontraron funciones</h2>
                        <p>
                            {searchTerm
                                ? 'Intenta con otro término de búsqueda'
                                : 'Pronto habrá nuevas funciones disponibles'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
