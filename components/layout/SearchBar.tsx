/**
 * Componente SearchBar - Barra de búsqueda para funciones de teatro
 * Permite buscar funciones en tiempo real y navegar a la página de resultados
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './SearchBar.module.css'

/**
 * Componente de barra de búsqueda
 * Redirige a /funciones con el término de búsqueda como query parameter
 */
export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    /**
     * Maneja el envío del formulario de búsqueda
     * @param e - Evento del formulario
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(`/funciones?search=${encodeURIComponent(searchTerm.trim())}`)
        } else {
            router.push('/funciones')
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar funciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton} aria-label="Buscar">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={styles.searchIcon}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </button>
            </div>
        </form>
    )
}
